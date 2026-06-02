from flask import Blueprint, render_template

from src.config.paths import M4FOOD_ASSETS_DIR
from src.features.portfolio.project_catalog import get_project_by_slug
from src.features.portfolio.project_detail_view import render_project_detail
from src.services.static_file_service import serve_file


m4food_bp = Blueprint("m4food", __name__, url_prefix="/projects/m4food")


@m4food_bp.route("/")
def detail():
    project = get_project_by_slug("m4food")
    return render_project_detail(project)


@m4food_bp.route("/demo/")
def demo():
    return render_template("m4food/index.html")


@m4food_bp.route("/assets/<path:filename>")
def assets(filename):
    return serve_file(M4FOOD_ASSETS_DIR, filename)
