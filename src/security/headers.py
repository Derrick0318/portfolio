import base64
import hashlib
import secrets
from html.parser import HTMLParser

from flask import g, request


class _CSPHashCollector(HTMLParser):
    """Collect hashes for static inline scripts and handler attributes."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.script_hashes = set()
        self.handler_hashes = set()
        self._inside_inline_script = False
        self._script_parts = []

    def _add_hash(self, value, destination):
        normalized = value.replace("\r\n", "\n").replace("\r", "\n")
        digest = base64.b64encode(hashlib.sha256(normalized.encode("utf-8")).digest()).decode("ascii")
        destination.add(f"'sha256-{digest}'")

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        if tag.lower() == "script":
            self._inside_inline_script = "src" not in attr_map
            self._script_parts = []

        for name, value in attrs:
            if name and name.lower().startswith("on") and value is not None:
                self._add_hash(value, self.handler_hashes)

    def handle_data(self, data):
        if self._inside_inline_script:
            self._script_parts.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._inside_inline_script:
            self._add_hash("".join(self._script_parts), self.script_hashes)
            self._inside_inline_script = False


def configure_security(app):
    app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = True

    @app.before_request
    def create_csp_nonce():
        g.csp_nonce = secrets.token_urlsafe(18)

    @app.context_processor
    def inject_csp_nonce():
        return {"csp_nonce": getattr(g, "csp_nonce", "")}

    @app.after_request
    def add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=()",
        )
        crop_yield_demo = request.path == "/projects/crop-yield/demo/"
        legacy_demo = (
            request.path.startswith("/projects/residential/demo/")
            and response.mimetype == "text/html"
        )
        if legacy_demo:
            # These older standalone pages still contain static inline scripts
            # and event attributes. Allow only their exact content hashes,
            # while the portfolio and newer demos block inline script execution.
            response.direct_passthrough = False
            collector = _CSPHashCollector()
            collector.feed(response.get_data(as_text=True))
            response.headers["Cache-Control"] = "no-store"
            inline_script_hashes = " ".join(sorted(collector.script_hashes))
            handler_hashes = " ".join(sorted(collector.handler_hashes))
            hash_policy = f"{inline_script_hashes} " if inline_script_hashes else ""
            if handler_hashes:
                hash_policy += f"'unsafe-hashes' {handler_hashes} "
            policy = (
                "default-src 'self'; base-uri 'self'; object-src 'none'; "
                "frame-ancestors 'self'; form-action 'self' https://docs.google.com; "
                f"script-src 'self' {hash_policy}https://accounts.google.com https://unpkg.com "
                "https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://code.jquery.com "
                "https://kit.fontawesome.com; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com "
                "https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://ka-f.fontawesome.com; "
                "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com "
                "https://ka-f.fontawesome.com; "
                "img-src 'self' data: blob: https:; "
                "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com "
                "https://docs.google.com https://ka-f.fontawesome.com; "
                "frame-src 'self' https://accounts.google.com https://www.google.com; "
                "upgrade-insecure-requests"
            )
        elif crop_yield_demo:
            # The crop demo's inline application script carries a per-response
            # nonce; event attributes were removed so inline script execution
            # remains blocked everywhere else on this page.
            nonce = getattr(g, "csp_nonce", "")
            policy = (
                "default-src 'self'; base-uri 'self'; object-src 'none'; "
                "frame-ancestors 'self'; form-action 'self'; "
                f"script-src 'self' 'nonce-{nonce}' https://accounts.google.com https://unpkg.com; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; "
                "font-src 'self' data: https://fonts.gstatic.com; "
                "img-src 'self' data: blob: https://*.googleusercontent.com; "
                "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com; "
                "frame-src 'self' https://accounts.google.com; upgrade-insecure-requests"
            )
        else:
            # Portfolio and project-detail templates use external scripts only.
            # Inline style attributes remain enabled for their present layouts.
            policy = (
                "default-src 'self'; base-uri 'self'; object-src 'none'; "
                "frame-ancestors 'self'; form-action 'self'; "
                "script-src 'self' https://cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com "
                "https://cdnjs.cloudflare.com; "
                "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
                "img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; "
                "upgrade-insecure-requests"
            )
        response.headers.setdefault("Content-Security-Policy", policy)

        if request.is_secure:
            response.headers.setdefault(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains",
            )

        return response
