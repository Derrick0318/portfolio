from flask import Blueprint, render_template

from src.features.portfolio.project_catalog import PROJECTS


portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/")
def home():
    return render_template("portfolio.html", projects=PROJECTS)
