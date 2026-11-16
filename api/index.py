"""
Jathin Ambati Portfolio - Vercel Serverless Python Backend API
High-reliability Python REST API with SQLite persistence and CORS.
Runs seamlessly on Vercel Serverless Functions and local development.
"""

import os
import sys
import json
import sqlite3
import urllib.request
import urllib.error
from datetime import datetime, timezone
from flask import Flask, request, jsonify, Response

app = Flask(__name__)

# Basic CORS Headers for all responses
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response

# Serverless-safe writable DB path (/tmp on Vercel / Linux, or local data directory)
if os.path.exists("/tmp") and os.access("/tmp", os.W_OK):
    DB_DIR = "/tmp"
elif os.environ.get("VERCEL"):
    DB_DIR = "/tmp"
else:
    DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

try:
    os.makedirs(DB_DIR, exist_ok=True)
except Exception:
    DB_DIR = "/tmp"
    os.makedirs(DB_DIR, exist_ok=True)

DB_PATH = os.path.join(DB_DIR, "portfolio.db")


def init_db():
    """Ensure database schema and initial counters exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitor_stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            visitor_count INTEGER DEFAULT 0,
            total_views INTEGER DEFAULT 0,
            last_visited_at TEXT
        )
    """)
    cursor.execute("SELECT id FROM visitor_stats WHERE id = 1")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO visitor_stats (id, visitor_count, total_views, last_visited_at)
            VALUES (1, 125, 125, ?)
        """, (datetime.now(timezone.utc).isoformat(),))
    conn.commit()
    conn.close()


# Ensure database initialized on import
try:
    init_db()
except Exception as e:
    sys.stderr.write(f"Warning: DB init error: {e}\n")


def forward_to_backend_if_bound(endpoint, method="GET", data=None):
    """If BACKEND_URL is set to a remote service, try calling it."""
    backend_url = os.environ.get("BACKEND_URL")
    if not backend_url or "localhost" in backend_url or "127.0.0.1" in backend_url:
        return None

    try:
        url = f"{backend_url.rstrip('/')}{endpoint}"
        body_bytes = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(
            url,
            data=body_bytes,
            headers={"Content-Type": "application/json"},
            method=method
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return Response(resp.read(), status=resp.status, content_type="application/json")
    except Exception:
        # Fall back to self-contained handler
        return None


@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    fwd = forward_to_backend_if_bound("/health", method="GET")
    if fwd:
        return fwd

    init_db()
    return jsonify({
        "status": "healthy",
        "service": "Jathin Ambati Portfolio Python Backend (Vercel Serverless)",
        "version": "1.0.0",
        "python_version": sys.version.split()[0],
        "database": f"SQLite3 ({DB_PATH})",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


@app.route("/api/visitor-count", methods=["GET"])
@app.route("/visitor-count", methods=["GET"])
def visitor_count():
    qs = f"?peek={request.args.get('peek', 'false')}" if request.args else ""
    fwd = forward_to_backend_if_bound(f"/visitor-count{qs}", method="GET")
    if fwd:
        return fwd

    init_db()
    read_only = request.args.get("peek", "false").lower() == "true"
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    if not read_only:
        cursor.execute("""
            UPDATE visitor_stats
            SET visitor_count = visitor_count + 1,
                total_views = total_views + 1,
                last_visited_at = ?
            WHERE id = 1
        """, (now_iso,))
        conn.commit()

    cursor.execute("SELECT visitor_count, total_views, last_visited_at FROM visitor_stats WHERE id = 1")
    row = cursor.fetchone()
    conn.close()

    count = row[0] if row else 125
    views = row[1] if row else 125
    visited = row[2] if row else now_iso

    return jsonify({
        "status": "success",
        "visitor_count": count,
        "total_views": views,
        "last_visited": visited
    })


@app.route("/api/contact", methods=["POST", "OPTIONS"])
@app.route("/contact", methods=["POST", "OPTIONS"])
@app.route("/api/feedback", methods=["POST", "OPTIONS"])
@app.route("/feedback", methods=["POST", "OPTIONS"])
def submit_contact():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
    fwd = forward_to_backend_if_bound("/contact", method="POST", data=data)
    if fwd:
        return fwd

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    subject = str(data.get("subject", "Portfolio Contact Form")).strip() or "Portfolio Contact Form"
    message = str(data.get("message", "")).strip()
    try:
        rating = int(data.get("rating", 5))
    except (ValueError, TypeError):
        rating = 5

    if not name or len(name) < 2:
        return jsonify({"status": "error", "message": "Please enter a valid name (at least 2 characters)."}), 400
    if not email or "@" not in email:
        return jsonify({"status": "error", "message": "Please enter a valid email address."}), 400
    if not message or len(message) < 5:
        return jsonify({"status": "error", "message": "Please enter a message (at least 5 characters)."}), 400

    init_db()
    now_iso = datetime.now(timezone.utc).isoformat()
    client_ip = request.headers.get("x-forwarded-for", request.remote_addr or "127.0.0.1").split(",")[0].strip()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO contacts (name, email, subject, message, rating, created_at, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (name, email, subject, message, rating, now_iso, client_ip))
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Thank you! Your message has been received by Jathin Ambati.",
        "submission_id": submission_id,
        "created_at": now_iso
    }), 201


@app.route("/api/contact/messages", methods=["GET"])
@app.route("/contact/messages", methods=["GET"])
def list_messages():
    fwd = forward_to_backend_if_bound("/contact/messages", method="GET")
    if fwd:
        return fwd

    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, email, subject, message, rating, created_at
        FROM contacts
        ORDER BY id DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    conn.close()

    messages = [
        {"id": r[0], "name": r[1], "email": r[2], "subject": r[3], "message": r[4], "rating": r[5], "created_at": r[6]}
        for r in rows
    ]
    return jsonify({
        "status": "success",
        "total_messages": len(messages),
        "messages": messages
    })


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"Python backend running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
