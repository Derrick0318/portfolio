from flask import render_template

from src.features.portfolio.project_catalog import PROJECTS


def render_project_detail(project):
    return render_template(
        "projects/detail.html",
        project=project,
        projects=PROJECTS,
    )
