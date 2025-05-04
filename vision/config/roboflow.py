

import os
from inference_sdk import InferenceHTTPClient

def get_roboflow_client():
    api_url = "https://detect.roboflow.com"
    api_key = os.getenv("ROBOFLOW_API_KEY")
    if not api_key:
        raise ValueError("ROBOFLOW_API_KEY environment variable not set")
    return InferenceHTTPClient(api_url=api_url, api_key=api_key)
