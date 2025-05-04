import base64
import os
from typing import Tuple
from inference_sdk import InferenceHTTPClient
from PIL import Image
from io import BytesIO
import cv2
import math
from fastapi import UploadFile
import asyncio
from ..constants import TEMP_DIR

def segment_image(image_file, client: InferenceHTTPClient) -> Tuple[str, dict]:
    """
    Process image segmentation and get predictions
    Returns tuple of (output_image_path, predictions)
    """
    # For binary data from a file that's already been read
    if isinstance(image_file, bytes):
        image_data = image_file
    else:
        # For handling UploadFile objects
        if hasattr(image_file, 'read'):
            image_data = image_file.read()
            if asyncio.iscoroutine(image_data):
                # We'll need to handle async behavior in a synchronous context
                loop = asyncio.get_event_loop() if asyncio.get_event_loop().is_running() else asyncio.new_event_loop()
                image_data = loop.run_until_complete(image_data)
        else:
            raise ValueError("Unsupported image_file type")

    encoded_image = base64.b64encode(image_data).decode("ascii")

    with client.use_model(model_id="grocery-dataset-q9fj2/5"):
        predictions = client.infer(encoded_image)

    temp_image_path = os.path.join(TEMP_DIR, "segmented_image.jpg")
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
    output_path = os.path.join(TEMP_DIR, "bounding_boxes_image.jpg")
    cv2.imwrite(output_path, image)
    return output_path

async def resize_image(image_file: UploadFile):
    image_data = await image_file.read()
    image = Image.open(BytesIO(image_data))
    resized_image = image.resize((640, 640))
    temp_resized_image_path = os.path.join(TEMP_DIR, "resized_input_image.jpg")
    resized_image.save(temp_resized_image_path, format="JPEG")
    return temp_resized_image_path
