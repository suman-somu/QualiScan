import time
import os
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from .config.logging_config import configure_logging
from .utils.image_processing import segment_image, encode_image_to_base64, draw_bounding_boxes
from .utils.db_operations import get_next_order_id, store_order_log_in_db
from .config.mongo import db
from .constants import IMAGE_TYPES, MODEL_NAMES
from .config.roboflow import get_roboflow_client
from .utils.llm_invoke import LLMInvoker
from .utils.sanitize import strip_json_markers, parse_json_content
from .utils.prompt.load_prompt import load_input_prompt
from .tasks.process_ocr_task import process_ocr_task

logger = configure_logging()
router = APIRouter()
roboflow_client = get_roboflow_client()

@router.post("/process-ocr/")
async def process_ocr(image: UploadFile = File(...), expected_values: str = Form(None)):
    start_time = time.time()
    logger.info("OCR processing started")

    try:
        # Generate orderid
        # order_id = get_next_order_id()
        # logger.info(f"Generated orderid: {order_id}")

        if image.content_type not in IMAGE_TYPES:
            logger.error("Invalid file type: %s", image.content_type)
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, JPG, and PNG are accepted.",
            )


        # Process and encode image
        # temp_image_path, predictions = await segment_image(image, roboflow_client)
        # output_image_path = draw_bounding_boxes(temp_image_path, predictions["predictions"])
        # segmented_image_base64 = encode_image_to_base64(output_image_path)
        # logger.info("Image encoding completed")
        # # clean up
        # os.remove(output_image_path)
        # os.remove(temp_image_path)


        # # Call LLM
        # input_prompt = load_input_prompt()

        # llm_invoker = LLMInvoker(MODEL_NAMES["GEMINI_FLASH_LITE"])
        # ai_msg = llm_invoker.invoke(input_prompt, image.content_type, segmented_image_base64)
        # logger.info("AI message received from LLM")

        # end_time = time.time()
        # processing_time = end_time - start_time
        # logger.info("OCR processing completed in %s seconds", processing_time)

        # ai_msg_content = strip_json_markers(ai_msg.content)
        # actual_values = parse_json_content(ai_msg_content)
        # expected_values = parse_json_content(expected_values)

        # store_order_log_in_db(order_id, expected_values, actual_values)

        # store the image inside the temp folder
        temp_dir = os.path.join(os.path.dirname(__file__), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        image_path = os.path.join(temp_dir, image.filename)
        with open(image_path, "wb") as f:
            f.write(await image.read())

        expected_values = parse_json_content(expected_values)

        # Process OCR task
        process_ocr_task.delay(image_path, image.content_type, expected_values)

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
