import time
import os
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from inference_sdk import InferenceHTTPClient
from .config.logging_config import configure_logging
from .utils.image_processing import segment_image, encode_image_to_base64, draw_bounding_boxes
from .utils.db_operations import get_next_order_id, insert_log
from .config.mongo import db
from .constants import IMAGE_TYPES
from .config.roboflow import get_roboflow_client


router = APIRouter()

logger = configure_logging()
roboflow_client = get_roboflow_client()

@router.post("/process-ocr/")
async def process_ocr(image: UploadFile = File(...), expected_values: str = Form(None)):
    start_time = time.time()
    logger.info("OCR processing started")

    try:
        # Generate orderid
        order_id = get_next_order_id()
        logger.info(f"Generated orderid: {order_id}")

        # Read prompt
        input_prompt_path = os.path.join(os.path.dirname(__file__), "input_prompt.txt")
        with open(input_prompt_path, "r") as file:
            input_prompt = file.read().strip()
        logger.info("Input prompt read from file")

        if image.content_type not in IMAGE_TYPES:
            logger.error("Invalid file type: %s", image.content_type)
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, JPG, and PNG are accepted.",
            )

        # Process image
        temp_image_path, predictions = await segment_image(image, roboflow_client)
        output_image_path = draw_bounding_boxes(temp_image_path, predictions["predictions"])
        os.remove(temp_image_path)
        logger.info("Image processing completed")

        # Encode image
        segmented_image_base64 = encode_image_to_base64(output_image_path)
        os.remove(output_image_path)
        logger.info("Image encoding completed")

        # Call LLM
        message = HumanMessage(
            content=[
                {"type": "text", "text": input_prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/{image.content_type.split('/')[-1]};base64,{segmented_image_base64}"
                    },
                },
            ]
        )

        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite")
        ai_msg = llm.invoke([message])
        logger.info("AI message received from LLM")

        end_time = time.time()
        processing_time = end_time - start_time
        logger.info("OCR processing completed in %s seconds", processing_time)

        ai_msg_content = ai_msg.content.strip("```json\n").strip("\n```")
        actual_values = json.loads(ai_msg_content)

        if expected_values is not None:
            expected_values = json.loads(expected_values)
        else:
            expected_values = []

        insert_log(order_id, expected_values, actual_values)

        return JSONResponse(
            content={
                "status": "success",
                "processing_time": processing_time,
            }
        )
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
