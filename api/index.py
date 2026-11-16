"""
Jathin Ambati Portfolio - Vercel Multi-Service API Gateway
Public service routed at /api/(.*).
Calls the internal 'backend' service using the Vercel Service Binding: BACKEND_URL.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from flask import Flask, request, jsonify, Response

app = Flask(__name__)

# Basic CORS Headers
@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    return response

# Bound internal service URL injected by Vercel from services.api.bindings
# In local dev without bindings, defaults to http://localhost:5000
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000").rstrip("/")


def call_backend(endpoint, method="GET", data=None, headers=None):
    """Forward a request to the internal backend service via BACKEND_URL."""
    if not endpoint.startswith("/"):
        endpoint = "/" + endpoint

    url = f"{BACKEND_URL}{endpoint}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        for k, v in headers.items():
            if k.lower() not in ("host", "content-length"):
                req_headers[k] = v

    body_bytes = None
    if data is not None:
        if isinstance(data, (dict, list)):
            body_bytes = json.dumps(data).encode("utf-8")
        elif isinstance(data, str):
            body_bytes = data.encode("utf-8")
        else:
            body_bytes = data

    req = urllib.request.Request(url, data=body_bytes, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp_body = resp.read()
            return Response(
                resp_body,
                status=resp.status,
                content_type=resp.headers.get("Content-Type", "application/json")
            )
    except urllib.error.HTTPError as e:
        err_body = e.read()
        return Response(
            err_body,
            status=e.code,
            content_type=e.headers.get("Content-Type", "application/json")
        )
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to reach internal backend service: {str(e)}",
            "backend_url": BACKEND_URL
        }), 502


@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return call_backend("/health", method="GET")


@app.route("/api/visitor-count", methods=["GET"])
@app.route("/visitor-count", methods=["GET"])
def visitor_count():
    qs = f"?peek={request.args.get('peek', 'false')}" if request.args else ""
    return call_backend(f"/visitor-count{qs}", method="GET")


@app.route("/api/contact", methods=["POST", "OPTIONS"])
@app.route("/contact", methods=["POST", "OPTIONS"])
@app.route("/api/feedback", methods=["POST", "OPTIONS"])
@app.route("/feedback", methods=["POST", "OPTIONS"])
def submit_contact():
    if request.method == "OPTIONS":
        return "", 204
    payload = request.get_json(silent=True) or {}
    return call_backend("/contact", method="POST", data=payload)


@app.route("/api/contact/messages", methods=["GET"])
@app.route("/contact/messages", methods=["GET"])
def list_messages():
    return call_backend("/contact/messages", method="GET")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"API service running on http://localhost:{port} (forwarding to {BACKEND_URL})")
    app.run(host="0.0.0.0", port=port, debug=True)
