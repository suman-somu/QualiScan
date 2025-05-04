from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

MODEL_NAMES = {
    "GEMINI_FLASH_LITE": "gemini-2.0-flash-lite",
    "GEMINI_PRO": "gemini-1.5-pro-latest",
    # Add more models here as needed
}

class LLMInvoker:
    def __init__(self, model_key: str):
        if model_key not in MODEL_NAMES:
            raise ValueError(f"Model key '{model_key}' not found in MODEL_NAMES.")
        self.model_name = MODEL_NAMES[model_key]
        self.llm = ChatGoogleGenerativeAI(model=self.model_name)

    def invoke(self, prompt: str, image_content_type: str, segmented_image_base64: str):
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/{image_content_type.split('/')[-1]};base64,{segmented_image_base64}"
                    },
                },
            ]
        )
        ai_msg = self.llm.invoke([message])
        return ai_msg
