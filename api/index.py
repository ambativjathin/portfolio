"""
Jathin Ambati Portfolio - Vercel Serverless Python API
Native Python backend running seamlessly on Vercel Serverless Functions.
Provides:
  - Live visitor counter with atomic increments
  - Contact and feedback submission with SQLite storage & validation
  - Health check & messages list
"""

import os
import sys
import json
import sqlite3
from datetime import datetime, timezone
from flask import Flask, request, jsonify

app = Flask(__name__)

# Apply CORS headers for all incoming requests
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response

# Serverless-safe writable DB path (/tmp on Vercel / AWS Lambda, or backend/data locally)
if os.environ.get("VERCEL"):
    DB_DIR = "/tmp"
else:
    DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", "data")

os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "portfolio.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Ensure database schema exists."""
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
            VALUES (1, 100, 100, ?)
        """, (datetime.now(timezone.utc).isoformat(),))
    conn.commit()
    conn.close()


# Ensure tables exist on cold start
try:
    init_db()
except Exception as e:
    sys.stderr.write(f"Warning: DB init failed: {e}\n")


@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Jathin Ambati Portfolio - Vercel Serverless Python Backend",
        "version": "1.0.0",
        "python_version": sys.version.split()[0],
        "database": f"SQLite3 ({DB_PATH})",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


@app.route("/api/visitor-count", methods=["GET"])
@app.route("/visitor-count", methods=["GET"])
def visitor_count():
    init_db()
    read_only = request.args.get("peek", "false").lower() == "true"
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

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

    return jsonify({
        "status": "success",
        "visitor_count": row[0] if row else 100,
        "total_views": row[1] if row else 100,
        "last_visited": row[2] if row else now_iso
    })


@app.route("/api/contact", methods=["POST", "OPTIONS"])
@app.route("/contact", methods=["POST", "OPTIONS"])
@app.route("/api/feedback", methods=["POST", "OPTIONS"])
@app.route("/feedback", methods=["POST", "OPTIONS"])
def submit_contact():
    if request.method == "OPTIONS":
        return "", 204

    data = request.get_json(silent=True) or {}
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
    print(f"Vercel Python API running locally on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
