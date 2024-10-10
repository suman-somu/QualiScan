import cv2
import pytesseract
import json

def ocr_image(img_path):
    # Read the image
    img = cv2.imread(img_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    # Use pytesseract to extract text
    text = pytesseract.image_to_string(thresh)
    
    # Format the text into a structured format (e.g., JSON)
    structured_text = {
        "extracted_text": text
    }
    
    return json.dumps(structured_text, indent=4)

# Example usage
if __name__ == "__main__":
    img_path = 'path_to_your_image.jpg'
    extracted_text = ocr_image(img_path)
    print(extracted_text)