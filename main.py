from fastapi import FastAPI
from vision.middleware import add_cors_middleware
from vision.routes import router
from vision.config import google_api_key, langchain_api_key, roboflow_api_key

app = FastAPI()

add_cors_middleware(app)
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)