from flask import Blueprint, jsonify, render_template, request

from src.config.paths import CROP_YIELD_ASSETS_DIR
from src.features.portfolio.project_catalog import get_project_by_slug
from src.features.portfolio.project_detail_view import render_project_detail
from src.features.crop_yield.demo_predictor import (
    build_demo_prediction,
    build_original_dashboard_prediction,
)
from src.services.static_file_service import serve_file


crop_yield_bp = Blueprint(
    "crop_yield",
    __name__,
    url_prefix="/projects/crop-yield",
)
crop_yield_legacy_bp = Blueprint("crop_yield_legacy", __name__)


@crop_yield_bp.route("/")
def detail():
    project = get_project_by_slug("crop-yield")
    return render_project_detail(project)


@crop_yield_bp.route("/demo/")
def demo():
    return render_template("crop_yield/index.html")


@crop_yield_bp.route("/assets/<path:filename>")
def assets(filename):
    return serve_file(CROP_YIELD_ASSETS_DIR, filename)


@crop_yield_bp.route("/demo-predict", methods=["POST"])
def demo_predict():
    payload = request.get_json(silent=True) or {}
    file_name = str(payload.get("fileName", "")).strip()
    return jsonify(build_demo_prediction(file_name))


@crop_yield_legacy_bp.route("/predict", methods=["POST"])
def predict():
    uploaded_file = request.files.get("image")
    file_name = uploaded_file.filename if uploaded_file else "uploaded-field.jpg"
    latitude = request.form.get("latitude", type=float)
    longitude = request.form.get("longitude", type=float)
    return jsonify(build_original_dashboard_prediction(file_name, latitude, longitude))


@crop_yield_legacy_bp.route("/health")
def health():
    return jsonify({"status": "healthy", "api_version": "portfolio-preview"})
