import os

IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

MODEL_NAMES = {
    "GEMINI_FLASH_LITE": "gemini-2.0-flash-lite",
    "GEMINI_PRO": "gemini-2.5-pro-latest",
    # Add more models here as needed
}

TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
