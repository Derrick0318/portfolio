from flask import Blueprint

from src.config.paths import RESIDENTIAL_DIR
from src.features.portfolio.project_catalog import get_project_by_slug
from src.features.portfolio.project_detail_view import render_project_detail
from src.services.static_file_service import serve_file


residential_bp = Blueprint(
    "residential",
    __name__,
    url_prefix="/projects/residential",
)


@residential_bp.route("/")
def detail():
    project = get_project_by_slug("residential")
    return render_project_detail(project)


@residential_bp.route("/demo/")
def demo_home():
    return serve_file(RESIDENTIAL_DIR, "index.html")


@residential_bp.route("/demo/<path:filename>")
def demo_file(filename):
    return serve_file(RESIDENTIAL_DIR, filename)


@residential_bp.route("/assets/<path:filename>")
def assets(filename):
    return serve_file(RESIDENTIAL_DIR / "assets", filename)
