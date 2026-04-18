import pytesseract
from PIL import Image
import io
import re

pytesseract.pytesseract.tesseract_cmd = r"F:\Tesseract\tesseract.exe"

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extracts text from an image using pytesseract.
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Extract text
        text = pytesseract.image_to_string(image)
        
        # Clean extracted text
        text = text.replace('\n', ' ')
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    except Exception as e:
        print(f"OCR Error: {e}", flush=True)
        return ""
