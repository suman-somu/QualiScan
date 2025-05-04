import base64
import os
from typing import Tuple
from inference_sdk import InferenceHTTPClient
from PIL import Image
from io import BytesIO
import cv2
import math
from fastapi import UploadFile

async def segment_image(image_file, client: InferenceHTTPClient) -> Tuple[str, dict]:
    """
    Process image segmentation and get predictions
    Returns tuple of (output_image_path, predictions)
    """
    image_data = await image_file.read()
    encoded_image = base64.b64encode(image_data).decode("ascii")

    with client.use_model(model_id="grocery-dataset-q9fj2/5"):
        predictions = client.infer(encoded_image)

    temp_image_path = "temp_input_image.jpg"
    with open(temp_image_path, "wb") as f:
        f.write(image_data)

    return temp_image_path, predictions

def encode_image_to_base64(image_path: str) -> str:
    """Encode image file to base64 string"""
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")

def image_to_base64(image_file: UploadFile) -> str:
    image = Image.open(image_file.file)
    buffered = BytesIO()
    image.save(buffered, format="JPEG" if image.format == "JPEG" else "PNG")
    image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return image_base64

def draw_bounding_boxes(image_path, predictions):
    image = cv2.imread(image_path)
    for prediction in predictions:
        x, y, width, height = (
            int(prediction["x"]),
            int(prediction["y"]),
            int(prediction["width"]),
            int(prediction["height"]),
        )
        top_left = (math.floor(x - width / 2), math.floor(y - height / 2))
        bottom_right = (math.floor(x + width / 2), math.floor(y + height / 2))
        cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
    output_path = "output_image_with_boxes.jpg"
    cv2.imwrite(output_path, image)
    return output_path

async def resize_image(image_file: UploadFile):
    image_data = await image_file.read()
    image = Image.open(BytesIO(image_data))
    resized_image = image.resize((640, 640))
    temp_resized_image_path = "temp_resized_image.jpg"
    resized_image.save(temp_resized_image_path, format="JPEG")
    return temp_resized_image_path
