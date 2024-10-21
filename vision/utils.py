import base64
import cv2
import math
from io import BytesIO
from PIL import Image
from fastapi import UploadFile

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