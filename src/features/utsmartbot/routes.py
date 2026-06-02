from flask import Blueprint, jsonify, request

from src.config.paths import UTSMARTBOT_TEMPLATE_DIR
from src.features.portfolio.project_catalog import get_project_by_slug
from src.features.portfolio.project_detail_view import render_project_detail
from src.features.utsmartbot.response_builder import build_local_response
from src.services.static_file_service import serve_file


utsmartbot_pages_bp = Blueprint(
    "utsmartbot_pages",
    __name__,
    url_prefix="/projects/utsmartbot",
)
utsmartbot_api_bp = Blueprint("utsmartbot_api", __name__)


@utsmartbot_pages_bp.route("/")
def detail():
    project = get_project_by_slug("utsmartbot")
    return render_project_detail(project)


@utsmartbot_pages_bp.route("/demo/")
@utsmartbot_pages_bp.route("/index.html")
@utsmartbot_pages_bp.route("/demo/index.html")
def demo():
    return serve_file(UTSMARTBOT_TEMPLATE_DIR, "index.html")


@utsmartbot_pages_bp.route("/website.css")
@utsmartbot_pages_bp.route("/demo/website.css")
def project_css():
    return serve_file(UTSMARTBOT_TEMPLATE_DIR, "website.css", mimetype="text/css")


@utsmartbot_api_bp.route("/website.css")
def legacy_css():
    return serve_file(UTSMARTBOT_TEMPLATE_DIR, "website.css", mimetype="text/css")


@utsmartbot_api_bp.route("/ask", methods=["POST"])
def ask():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()[:500]

    if not message:
        return jsonify({"response": "No input received"})

    return jsonify({"response": build_local_response(message)})
