import time
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from .config.logging_config import configure_logging
from .config.mongo import db
from .constants import IMAGE_TYPES, TEMP_DIR
from .config.roboflow import get_roboflow_client
from .utils.sanitize import parse_json_content
from .tasks.process_ocr_task import process_ocr_task

logger = configure_logging()
router = APIRouter()
roboflow_client = get_roboflow_client()

@router.post("/process-ocr/")
async def process_ocr(image: UploadFile = File(...), expected_values: str = Form(None)):
    start_time = time.time()
    logger.info("OCR processing started")

    try:
        if image.content_type not in IMAGE_TYPES:
            logger.error("Invalid file type: %s", image.content_type)
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, JPG, and PNG are accepted.",
            )

        temp_image_path = os.path.join(TEMP_DIR, image.filename)
        with open(temp_image_path, "wb") as f:
            f.write(await image.read())

        expected_values = parse_json_content(expected_values)

        process_ocr_task.delay(temp_image_path, image.content_type, expected_values)

        return JSONResponse(content={"status": "success"})
    except Exception as e:
        logger.error("Error during OCR processing at process_ocr: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/orders/")
async def get_orders():
    try:
        orders = list(db["logs"].find())
        for order in orders:
            order["_id"] = str(order["_id"])
        return JSONResponse(content={"orders": orders})
    except Exception as e:
        logger.error("Error fetching orders at get_orders: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/health/")
def health_check():
    logger.info("Health check endpoint called")
    return {"status": "OK"}
