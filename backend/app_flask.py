"""
Jathin Ambati Portfolio - Flask Backend Implementation
Alternative Flask framework runner using SQLite3 persistence and CORS.
"""

import sys
if sys.version_info[0] < 3:
    sys.stderr.write("Error: Python 3 is required to run the portfolio Flask backend.\n")
    sys.stderr.write("Please run using Python 3: python3.12 backend/app_flask.py (or python3 / py -3)\n")
    sys.exit(1)

import os
import json
import sqlite3
import smtplib
import ssl
import urllib.request
import urllib.error
from datetime import datetime, timezone
from email.message import EmailMessage
from flask import Flask, request, jsonify

app = Flask(__name__)

# Basic CORS Headers after request
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response

# Serverless-safe writable DB path (/tmp on Vercel, or backend/data locally)
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


def redis_visitor_op(increment=False):
    """
    Attempt to use Upstash Redis or Vercel KV for distributed serverless visitor counting
    if environment variables are provided. Uses standard urllib (zero dependencies).
    """
    base_url = (os.environ.get("UPSTASH_REDIS_REST_URL") or os.environ.get("KV_REST_API_URL") or "").rstrip("/")
    token = os.environ.get("UPSTASH_REDIS_REST_TOKEN") or os.environ.get("KV_REST_API_TOKEN") or ""
    if not base_url or not token:
        return None

    try:
        cmd = "incr" if increment else "get"
        req_url = f"{base_url}/{cmd}/portfolio:visitor_count"
        req = urllib.request.Request(
            req_url,
            headers={"Authorization": f"Bearer {token}"},
            method="POST" if increment else "GET"
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            val = data.get("result")
            if val is not None:
                return int(val)
    except Exception as e:
        sys.stderr.write(f"Warning: Redis counter error: {e}\n")
    return None


def send_contact_email(name, sender_email, subject, message, rating, created_at):
    """
    Send contact/feedback notification email via Resend API or SMTP (e.g. Gmail App Password).
    Returns True if an email was sent, False otherwise.
    """
    to_email = os.environ.get("CONTACT_TO_EMAIL", "ambativjathin@gmail.com").strip()
    email_subject = f"[Portfolio] {subject} — from {name}"
    body_text = (
        f"New portfolio message / feedback received:\n\n"
        f"Name:    {name}\n"
        f"Email:   {sender_email}\n"
        f"Subject: {subject}\n"
        f"Rating:  {rating}/5\n"
        f"Time:    {created_at}\n\n"
        f"Message:\n{message}\n"
    )

    resend_key = os.environ.get("RESEND_API_KEY", "").strip()
    if resend_key:
        try:
            from_addr = os.environ.get("RESEND_FROM_EMAIL", "Portfolio Contact <onboarding@resend.dev>").strip()
            payload = json.dumps({
                "from": from_addr,
                "to": [to_email],
                "reply_to": sender_email,
                "subject": email_subject,
                "text": body_text,
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=payload,
                headers={
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                if 200 <= resp.status < 300:
                    return True
        except Exception as e:
            sys.stderr.write(f"Warning: Resend email error: {e}\n")

    smtp_user = (os.environ.get("SMTP_USER") or os.environ.get("GMAIL_USER") or "").strip()
    smtp_pass = (os.environ.get("SMTP_PASS") or os.environ.get("GMAIL_APP_PASSWORD") or "").strip()
    if smtp_user and smtp_pass:
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
        smtp_port = int(os.environ.get("SMTP_PORT", "465"))
        try:
            msg = EmailMessage()
            msg["Subject"] = email_subject
            msg["From"] = smtp_user
            msg["To"] = to_email
            msg["Reply-To"] = sender_email
            msg.set_content(body_text)

            context = ssl.create_default_context()
            if smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=8) as server:
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=8) as server:
                    server.starttls(context=context)
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
            return True
        except Exception as e:
            sys.stderr.write(f"Warning: SMTP email error: {e}\n")

    return False


def init_db():
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
    initial_offset = int(os.environ.get("INITIAL_VISITOR_COUNT", "0"))
    reset_requested = os.environ.get("RESET_VISITOR_COUNT", "false").lower() == "true"

    cursor.execute("SELECT visitor_count FROM visitor_stats WHERE id = 1")
    row = cursor.fetchone()
    if not row:
        cursor.execute("""
            INSERT INTO visitor_stats (id, visitor_count, total_views, last_visited_at)
            VALUES (1, ?, ?, ?)
        """, (initial_offset, initial_offset, datetime.now(timezone.utc).isoformat()))
    elif reset_requested or row[0] in (125, 126):
        cursor.execute("""
            UPDATE visitor_stats
            SET visitor_count = ?,
                total_views = ?,
                last_visited_at = ?
            WHERE id = 1
        """, (initial_offset, initial_offset, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()


# Ensure tables exist on load
try:
    init_db()
except Exception as e:
    sys.stderr.write(f"Warning: DB init error: {e}\n")


@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    init_db()
    return jsonify({
        "status": "healthy",
        "service": "Jathin Ambati Portfolio Flask Backend",
        "version": "1.0.0",
        "database": f"SQLite3 ({DB_PATH})"
    })


@app.route("/api/visitor-count", methods=["GET"])
@app.route("/visitor-count", methods=["GET"])
def visitor_count():
    read_only = request.args.get("peek", "false").lower() == "true"
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Use Upstash Redis / Vercel KV if configured (provides persistent cross-container counting)
    redis_val = redis_visitor_op(increment=not read_only)
    if redis_val is not None:
        return jsonify({
            "status": "success",
            "visitor_count": redis_val,
            "total_views": redis_val,
            "last_visited": now_iso,
            "persistence": "redis_kv"
        })

    # 2. SQLite fallback
    init_db()
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
    initial_offset = int(os.environ.get("INITIAL_VISITOR_COUNT", "0"))
    return jsonify({
        "status": "success",
        "visitor_count": row[0] if row else initial_offset,
        "total_views": row[1] if row else initial_offset,
        "last_visited": row[2] if row else now_iso,
        "persistence": "sqlite"
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
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO contacts (name, email, subject, message, rating, created_at, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (name, email, subject, message, rating, now_iso, request.remote_addr))
    sub_id = cursor.lastrowid
    conn.commit()
    conn.close()

    email_sent = send_contact_email(name, email, subject, message, rating, now_iso)

    return jsonify({
        "status": "success",
        "message": "Thank you! Your message has been received by Jathin Ambati.",
        "submission_id": sub_id,
        "email_sent": email_sent
    }), 201


@app.route("/api/contact/messages", methods=["GET"])
@app.route("/contact/messages", methods=["GET"])
def list_messages():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, subject, message, rating, created_at FROM contacts ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    messages = [
        {"id": r[0], "name": r[1], "email": r[2], "subject": r[3], "message": r[4], "rating": r[5], "created_at": r[6]}
        for r in rows
    ]
    return jsonify({"status": "success", "total_messages": len(messages), "messages": messages})


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"Flask backend running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
