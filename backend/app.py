"""
Jathin Ambati Portfolio - Backend Service Entrypoint
"""

import os
from app_flask import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
