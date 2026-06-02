from flask import Flask

from src.config.paths import BASE_DIR
from src.features.crop_yield.routes import crop_yield_bp, crop_yield_legacy_bp
from src.features.m4food.routes import m4food_bp
from src.features.portfolio.routes import portfolio_bp
from src.features.residential.routes import residential_bp
from src.features.utsmartbot.routes import utsmartbot_api_bp, utsmartbot_pages_bp
from src.security.headers import configure_security


def create_app():
    app = Flask(
        __name__,
        template_folder=str(BASE_DIR / "templates"),
        static_folder=str(BASE_DIR / "static"),
    )
    configure_security(app)
    app.register_blueprint(portfolio_bp)
    app.register_blueprint(utsmartbot_pages_bp)
    app.register_blueprint(utsmartbot_api_bp)
    app.register_blueprint(residential_bp)
    app.register_blueprint(m4food_bp)
    app.register_blueprint(crop_yield_bp)
    app.register_blueprint(crop_yield_legacy_bp)
    return app
