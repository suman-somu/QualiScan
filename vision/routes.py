import time
import base64
import os
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from inference_sdk import InferenceHTTPClient
from .utils import draw_bounding_boxes, resize_image
from .config import google_api_key, langchain_api_key, roboflow_api_key
from .mongo import insert_log, db
import json
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com", api_key=os.getenv("ROBOFLOW_API_KEY")
)


async def segment_image_and_get_predictions(image_file: UploadFile):
    logger.info("Starting image segmentation and prediction")
    image_data = await image_file.read()
    encoded_image = base64.b64encode(image_data).decode("ascii")
    logger.info("Image encoded to base64")
    with client.use_model(model_id="grocery-dataset-q9fj2/5"):
        predictions = client.infer(encoded_image)
    logger.info("Predictions received from model")
    temp_image_path = "temp_input_image.jpg"
    with open(temp_image_path, "wb") as f:
        f.write(image_data)
    logger.info("Temporary image file created")
    output_image_path = draw_bounding_boxes(temp_image_path, predictions["predictions"])
    logger.info("Bounding boxes drawn on image")
    os.remove(temp_image_path)
    logger.info("Temporary image file removed")
    return output_image_path


@router.post("/process-ocr/")
async def process_ocr(image: UploadFile = File(...), expected_values: str = Form(None)):
    start_time = time.time()
    logger.info("OCR processing started")
    try:
        input_prompt_path = os.path.join(os.path.dirname(__file__), "input_prompt.txt")
        with open(input_prompt_path, "r") as file:
            input_prompt = file.read().strip()
        logger.info("Input prompt read from file")
        if image.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            logger.error("Invalid file type: %s", image.content_type)
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, JPG, and PNG are accepted.",
            )
        output_image_path = await segment_image_and_get_predictions(image)
        logger.info("Image segmentation and prediction completed")
        with open(output_image_path, "rb") as img_file:
            segmented_image_base64 = base64.b64encode(img_file.read()).decode("utf-8")
        logger.info("Segmented image encoded to base64")
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
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
        ai_msg = llm.invoke([message])
        logger.info("AI message received from LLM")
        end_time = time.time()
        processing_time = end_time - start_time
        logger.info("OCR processing completed in %s seconds", processing_time)

        # Extract JSON content from ai_msg
        ai_msg_content = ai_msg.content.strip("```json\n").strip("\n```")
        actual_values = json.loads(ai_msg_content)
        print(actual_values)

        # Parse expected_values as an array of objects if it's not None
        if expected_values is not None:
            expected_values = json.loads(expected_values)
        else:
            expected_values = []

        # Generate a dummy order ID
        order_id = f"order_{random.randint(1000, 9999)}"

        # Insert log into MongoDB
        insert_log(order_id, expected_values, actual_values)

        return JSONResponse(
            content={
                "status": "success",
                "processing_time": processing_time,
            }
        )
    except Exception as e:
        logger.error("Error during OCR processing: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders/")
async def get_orders():
    try:
        orders = list(db["logs"].find())
        for order in orders:
            order["_id"] = str(order["_id"])  # Convert ObjectId to string for JSON serialization
        return JSONResponse(content={"orders": orders})
    except Exception as e:
        logger.error("Error fetching orders: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/health/")
def health_check():
    logger.info("Health check endpoint called")
    return {"status": "OK"}