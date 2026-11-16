"""
Jathin Ambati Portfolio - Python Backend Server
Zero-dependency, production-ready REST API using Python standard library:
- SQLite3 for persistent data storage
- http.server with full CORS support
- Endpoints for Contact Form submission, Live Visitor Counter, and Admin view
"""

import sys
if sys.version_info[0] < 3:
    sys.stderr.write("Error: Python 3 is required to run the portfolio backend server.\n")
    sys.stderr.write("Please run using Python 3: python3.12 backend/server.py (or python3 / py -3)\n")
    sys.exit(1)

import os
import json
import sqlite3
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Configuration
PORT = int(os.environ.get("PORT", 5000))
HOST = os.environ.get("HOST", "0.0.0.0")
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "portfolio.db")


def init_db():
    """Initialize the SQLite database schema if not already present."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Contact Form & Feedback Messages Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT DEFAULT 'General Inquiry',
            message TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            created_at TEXT NOT NULL,
            ip_address TEXT
        )
    """)

    # 2. Visitor Statistics Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitor_stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            visitor_count INTEGER DEFAULT 0,
            total_views INTEGER DEFAULT 0,
            last_visited_at TEXT
        )
    """)

    # Ensure initial visitor record exists
    cursor.execute("SELECT id FROM visitor_stats WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO visitor_stats (id, visitor_count, total_views, last_visited_at)
            VALUES (1, 100, 100, ?)
        """, (datetime.now(timezone.utc).isoformat(),))

    # 3. Visitor Audit Logs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitor_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            user_agent TEXT,
            path TEXT
        )
    """)

    conn.commit()
    conn.close()
    print(f"[DB] SQLite database initialized at {DB_PATH}")


def increment_visitor_count(user_agent="", path="/"):
    """Atomically increment the visitor count and log the visit."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
        UPDATE visitor_stats
        SET visitor_count = visitor_count + 1,
            total_views = total_views + 1,
            last_visited_at = ?
        WHERE id = 1
    """, (now_iso,))

    cursor.execute("""
        INSERT INTO visitor_logs (timestamp, user_agent, path)
        VALUES (?, ?, ?)
    """, (now_iso, user_agent[:250], path[:100]))

    cursor.execute("SELECT visitor_count, total_views, last_visited_at FROM visitor_stats WHERE id = 1")
    row = cursor.fetchone()
    conn.commit()
    conn.close()

    return {
        "visitor_count": row[0],
        "total_views": row[1],
        "last_visited": row[2]
    }


def get_visitor_stats():
    """Retrieve the current visitor statistics without incrementing."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT visitor_count, total_views, last_visited_at FROM visitor_stats WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "visitor_count": row[0],
            "total_views": row[1],
            "last_visited": row[2]
        }
    return {"visitor_count": 0, "total_views": 0, "last_visited": None}


def save_contact_message(data, ip_address="127.0.0.1"):
    """Validate and insert a new contact / feedback form submission into SQLite."""
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    subject = str(data.get("subject", "Portfolio Contact Form")).strip() or "Portfolio Contact Form"
    message = str(data.get("message", "")).strip()
    try:
        rating = int(data.get("rating", 5))
    except (ValueError, TypeError):
        rating = 5

    if not name or len(name) < 2:
        return False, "Please enter a valid name (at least 2 characters)."
    if not email or "@" not in email or "." not in email:
        return False, "Please enter a valid email address."
    if not message or len(message) < 5:
        return False, "Please enter a message (at least 5 characters)."

    now_iso = datetime.now(timezone.utc).isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO contacts (name, email, subject, message, rating, created_at, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (name, email, subject, message, rating, now_iso, ip_address))
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return True, {
        "submission_id": submission_id,
        "name": name,
        "email": email,
        "created_at": now_iso
    }


def get_all_contacts(limit=50):
    """Fetch recent contact form submissions (for administration / viewing)."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, email, subject, message, rating, created_at
        FROM contacts
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "name": r[1],
            "email": r[2],
            "subject": r[3],
            "message": r[4],
            "rating": r[5],
            "created_at": r[6]
        })
    return results


class PortfolioAPIHandler(BaseHTTPRequestHandler):
    """HTTP Request Handler providing REST endpoints with full CORS headers."""

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        # Enable Cross-Origin Resource Sharing (CORS)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.end_headers()

    def do_OPTIONS(self):
        """Respond to preflight CORS checks."""
        self._set_headers(204)

    def do_GET(self):
        """Handle GET requests."""
        parsed_url = urlparse(self.path)
        path = parsed_url.path.rstrip("/") or "/"

        if path == "/api/health":
            self._set_headers(200)
            payload = {
                "status": "healthy",
                "service": "Jathin Ambati Portfolio Python Backend",
                "version": "1.0.0",
                "python_version": sys.version.split()[0],
                "database": "SQLite3 (portfolio.db)",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))

        elif path in ("/api/visitor-count", "/api/visitors"):
            # Query param: check if we should only read without incrementing
            query_params = parse_qs(parsed_url.query)
            read_only = query_params.get("peek", ["false"])[0].lower() == "true"
            user_agent = self.headers.get("User-Agent", "Unknown")

            if read_only:
                stats = get_visitor_stats()
            else:
                stats = increment_visitor_count(user_agent=user_agent, path=path)

            self._set_headers(200)
            payload = {
                "status": "success",
                "visitor_count": stats["visitor_count"],
                "total_views": stats["total_views"],
                "last_visited": stats["last_visited"]
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))

        elif path == "/api/contact/messages":
            contacts = get_all_contacts(limit=50)
            self._set_headers(200)
            payload = {
                "status": "success",
                "total_messages": len(contacts),
                "messages": contacts
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))

        else:
            self._set_headers(404)
            payload = {
                "status": "error",
                "message": f"Endpoint not found: {path}",
                "available_endpoints": [
                    "GET  /api/health",
                    "GET  /api/visitor-count",
                    "POST /api/contact",
                    "GET  /api/contact/messages"
                ]
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_POST(self):
        """Handle POST requests (Contact Form / Feedback)."""
        parsed_url = urlparse(self.path)
        path = parsed_url.path.rstrip("/")

        if path in ("/api/contact", "/api/feedback"):
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self._set_headers(400)
                self.wfile.write(json.dumps({"status": "error", "message": "Empty request body"}).encode("utf-8"))
                return

            try:
                body_bytes = self.rfile.read(content_length)
                data = json.loads(body_bytes.decode("utf-8"))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"status": "error", "message": f"Invalid JSON payload: {str(e)}"}).encode("utf-8"))
                return

            client_ip = self.client_address[0]
            success, result = save_contact_message(data, ip_address=client_ip)

            if success:
                self._set_headers(201)
                payload = {
                    "status": "success",
                    "message": "Thank you! Your message has been received by Jathin Ambati.",
                    "details": result
                }
                self.wfile.write(json.dumps(payload).encode("utf-8"))
            else:
                self._set_headers(400)
                payload = {
                    "status": "error",
                    "message": result
                }
                self.wfile.write(json.dumps(payload).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"status": "error", "message": f"Endpoint not found: {path}"}).encode("utf-8"))

    def log_message(self, format, *args):
        """Clean log output formatting."""
        sys.stderr.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Python Backend - {format % args}\n")


def run(server_class=HTTPServer, handler_class=PortfolioAPIHandler, port=PORT, host=HOST):
    init_db()
    server_address = (host, port)
    httpd = server_class(server_address, handler_class)
    print("=" * 65)
    print("  🚀 Jathin Ambati Portfolio - Python Backend Server Running")
    print("=" * 65)
    print(f"  • Host:     http://{host}:{port}")
    print(f"  • Local:    http://localhost:{port}")
    print(f"  • Health:   http://localhost:{port}/api/health")
    print(f"  • Visitors: http://localhost:{port}/api/visitor-count")
    print(f"  • Messages: http://localhost:{port}/api/contact/messages")
    print("  • Database: SQLite3 at backend/data/portfolio.db")
    print("=" * 65)
    print("Press Ctrl+C to stop the server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down Python backend...")
        httpd.server_close()
        print("[Server] Server stopped cleanly.")


if __name__ == "__main__":
    run()
