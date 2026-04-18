import random

def classify_news(text: str) -> tuple[str, float]:
    """
    Rule-based Fake/Real classification and credibility scoring.
    """
    text_lower = text.lower()
    
    # List of known fake news keywords/phrases
    fake_phrases = [
        "sun smaller than earth",
        "cures all diseases",
        "flat earth",
        "drink bleach",
        "vaccines cause magnetism",
        "birds aren't real"
    ]
    
    # Check if any fake phrase is in the text
    is_fake = any(phrase in text_lower for phrase in fake_phrases)
    
    if is_fake:
        label = "Fake"
        score = round(random.uniform(5.0, 30.0), 1)
    else:
        label = "Real"
        score = round(random.uniform(80.0, 99.0), 1)
        
    return label, score
