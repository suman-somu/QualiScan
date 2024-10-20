import base64
import os
import cv2
import io
import time
import math

from io import BytesIO
from PIL import Image

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from inference_sdk import InferenceHTTPClient
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

#mongodb
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel


load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")
langchain_api_key = os.getenv("LANGCHAIN_API_KEY")
roboflow_api_key = os.getenv("ROBOFLOW_API_KEY")
if google_api_key is None or langchain_api_key is None:
    raise ValueError(
        "Environment variables GOOGLE_API_KEY and LANGCHAIN_API_KEY must be set"
    )
os.environ["GOOGLE_API_KEY"] = google_api_key
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = langchain_api_key

# MongoDB connection string
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["mydatabase"]

app = FastAPI()

# Allow CORS from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com", api_key=roboflow_api_key
)

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
        
        # Remove label display
        # class_name = prediction.get("class", "Unknown")
        # confidence = prediction.get("confidence", 0)
        # label = f"{class_name}: {confidence:.2f}"
        # cv2.putText(
        #     image, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
        # )

    output_path = "output_image_with_boxes.jpg"
    cv2.imwrite(output_path, image)
    return output_path

async def resize_image(image_file: UploadFile):
    # Read the image data from the file
    image_data = await image_file.read()
    
    # Open the image using PIL
    image = Image.open(BytesIO(image_data))
    
    # Resize the image to 640x640
    resized_image = image.resize((640, 640))
    
    # Save the resized image to a temporary path
    temp_resized_image_path = "temp_resized_image.jpg"
    resized_image.save(temp_resized_image_path, format="JPEG")
    
    return temp_resized_image_path


async def segment_image_and_get_predictions(image_file: UploadFile):

    image_data = await image_file.read()
    encoded_image = base64.b64encode(image_data).decode("ascii")

    with client.use_model(model_id="grocery-dataset-q9fj2/5"):
        predictions = client.infer(encoded_image)

    temp_image_path = "temp_input_image.jpg"
    with open(temp_image_path, "wb") as f:
        f.write(image_data)

    output_image_path = draw_bounding_boxes(temp_image_path, predictions["predictions"])

    os.remove(temp_image_path)

    return output_image_path

@app.post("/process-ocr/")
async def process_ocr(image: UploadFile = File(...)):
    start_time = time.time()
    try:
        with open("input_prompt.txt", "r") as file:
            input_prompt = file.read().strip()

        if image.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, JPG, and PNG are accepted.",
            )

        output_image_path = await segment_image_and_get_predictions(image)

        with open(output_image_path, "rb") as img_file:
            segmented_image_base64 = base64.b64encode(img_file.read()).decode("utf-8")

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

        end_time = time.time()
        processing_time = end_time - start_time

        return JSONResponse(
            content={
                "Output": ai_msg.content,
                "Processing Time (seconds)": processing_time,
            },
            status_code=200,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health/")
def health_check():
    return {"status": "OK"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
