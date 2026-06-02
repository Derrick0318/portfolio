from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
PROJECTS_DIR = BASE_DIR / "projects"

UTSMARTBOT_TEMPLATE_DIR = PROJECTS_DIR / "utsmartbot" / "templates"
RESIDENTIAL_DIR = PROJECTS_DIR / "residential"
M4FOOD_ASSETS_DIR = PROJECTS_DIR / "m4food" / "assets"
CROP_YIELD_ASSETS_DIR = PROJECTS_DIR / "crop-yield" / "assets"
