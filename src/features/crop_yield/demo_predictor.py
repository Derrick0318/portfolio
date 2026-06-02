from datetime import datetime
from hashlib import sha256


CROP_OPTIONS = [
    ("Paddy", "strong moisture profile"),
    ("Oil Palm", "stable tropical conditions"),
    ("Pineapple", "moderate dry-soil tolerance"),
    ("Banana", "high warm-climate fit"),
    ("Corn", "good field uniformity"),
]


def clean_file_name(file_name):
    text = str(file_name or "").strip()
    return text[:140] or "uploaded-field.jpg"


def build_demo_prediction(file_name):
    file_name = clean_file_name(file_name)
    digest = sha256(file_name.encode("utf-8")).hexdigest()
    score = int(digest[:4], 16)
    yield_value = round(2.8 + (score % 520) / 100, 2)
    yield_class = "Good" if yield_value >= 6.2 else "Fair" if yield_value >= 4.4 else "Poor"
    start = score % len(CROP_OPTIONS)
    crops = [CROP_OPTIONS[(start + index) % len(CROP_OPTIONS)] for index in range(3)]

    return {
        "fileName": file_name,
        "predictedYield": yield_value,
        "yieldClass": yield_class,
        "crops": [{"name": name, "reason": reason} for name, reason in crops],
    }


def build_original_dashboard_prediction(file_name, latitude=None, longitude=None):
    prediction = build_demo_prediction(file_name)
    crop_names = [crop["name"] for crop in prediction["crops"]]

    return {
        "predicted_yield": prediction["predictedYield"],
        "predicted_class": prediction["yieldClass"],
        "top3_crops": [{"name": crop_name} for crop_name in crop_names],
        "features": {
            "Index_Mean": 0.71,
            "Index_StdDev": 0.14,
            "Max_Index": 0.93,
            "Mean_Blue": 0.28,
            "Veg_Coverage": 0.68,
        },
        "api_version": "portfolio",
        "location_provided": latitude is not None and longitude is not None,
        "image_url": "",
        "timestamp": datetime.now().isoformat(),
        "file_name": clean_file_name(file_name),
        "latitude": latitude,
        "longitude": longitude,
        "coordinates": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "location_name": "Awaiting Location",
        "weather": {
            "temp_max": 30,
            "precipitation": 4,
        },
        "soil": {
            "soil_type": "Loam",
            "soil_ph": 65,
        },
    }
