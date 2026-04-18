from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Optional
from services import nlp, translation, rag, explanation, ocr
from utils import language

router = APIRouter()

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    label: str
    score: float
    explanation: str
    detected_language: str
    facts: list[str]
    extracted_text: Optional[str] = None

def process_text_pipeline(text: str) -> PredictResponse:
    # 2. Language detection
    lang = language.detect_language(text)
    
    # 3. Translation (if needed)
    english_text = translation.translate_to_english(text, lang)
    
    # 4 & 5. Fake news classification & Credibility score
    # _, score = nlp.classify_news(english_text)
    
    # 6. Fact retrieval
    facts = rag.retrieve_facts(english_text)
    
    # 7. LLM Reasoning & Explanation generation
    label, score, exp = explanation.generate_explanation(english_text, facts)
    
    return PredictResponse(
        label=label,
        score=score,
        explanation=exp,
        detected_language=lang,
        facts=facts
    )

@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    return process_text_pipeline(request.text)

@router.post("/predict-image", response_model=PredictResponse)
async def predict_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")
        
    extracted_text = ocr.extract_text_from_image(contents)
    
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from the provided image")
        
    response = process_text_pipeline(extracted_text)
    response.extracted_text = extracted_text
    
    return response
