from flask import Blueprint

from src.features.portfolio.project_catalog import get_project_by_slug
from src.features.portfolio.project_detail_view import render_project_detail


trackwize_bp = Blueprint("trackwize", __name__, url_prefix="/projects/trackwize")


@trackwize_bp.route("/")
def detail():
    project = get_project_by_slug("trackwize")
    return render_project_detail(project)
