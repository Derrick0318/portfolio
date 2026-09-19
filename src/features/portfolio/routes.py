from flask import Blueprint, render_template

from src.features.portfolio.project_catalog import PROJECTS


portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/")
def home():
    featured_projects = [project for project in PROJECTS if project.get("featured", False)]
    additional_projects = [project for project in PROJECTS if not project.get("featured", False)]
    return render_template(
        "portfolio.html",
        featured_projects=featured_projects,
        additional_projects=additional_projects,
    )
