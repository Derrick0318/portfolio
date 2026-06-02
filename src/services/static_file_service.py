from pathlib import Path

from flask import abort, send_from_directory


BLOCKED_SUFFIXES = {
    ".db",
    ".env",
    ".key",
    ".keystore",
    ".p12",
    ".pem",
    ".pfx",
    ".pkl",
    ".py",
    ".pyc",
    ".sqlite",
}


def serve_file(directory, filename, mimetype=None):
    requested_path = Path(filename)
    if requested_path.name.startswith(".") or requested_path.suffix.lower() in BLOCKED_SUFFIXES:
        abort(404)

    return send_from_directory(str(directory), filename, mimetype=mimetype)
