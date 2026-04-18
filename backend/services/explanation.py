from dotenv import load_dotenv
import os
import json
from google import genai

# Load .env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

client = genai.Client()

SCORING_WEIGHTS = {
    "factual_accuracy": 0.4,
    "source_reliability": 0.3,
    "claim_clarity": 0.1,
    "sensationalism": 0.2
}


def compute_score(scores):
    total = 0
    for key in SCORING_WEIGHTS:
        val = scores.get(key, 50)
        if key == "sensationalism":
            val = 100 - val
        total += val * SCORING_WEIGHTS[key]
    return round(total, 2)


def generate_explanation(claim, facts):
    prompt = f"""
Claim: {claim}
Facts: {facts}

You MUST base your answer ONLY on the provided facts.

If the facts contradict your prior knowledge, trust the facts.

Do NOT use external or prior knowledge.

If a news source is provided, treat it as ground truth unless clearly contradictory.

Evaluate the claim carefully.

Rules:
- If fully correct → REAL
- If partially true → MISLEADING
- If false → FAKE
- If no sources available, do NOT assume false

Return ONLY valid JSON.
No markdown. No extra text.

{{
  "label": "REAL / MISLEADING / FAKE",
  "explanation": "...",
  "scores": {{
    "factual_accuracy": 0-100,
    "source_reliability": 0-100,
    "claim_clarity": 0-100,
    "sensationalism": 0-100
  }}
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",  #2.5 flash can also be used
            contents=prompt
        )

        output = response.text
        print("RAW:", output, flush=True)

        import re
        match = re.search(r"\{.*\}", output, re.DOTALL)
        if not match:
            return "REAL", 50, output

        parsed = json.loads(match.group())

        label = parsed.get("label", "REAL")
        explanation = parsed.get("explanation", "")
        scores = parsed.get("scores", {})

        final_score = compute_score(scores)

        return label, final_score, explanation

    except Exception as e:
        print("EXCEPTION:", e, flush=True)
        return "REAL", 50, "Fallback: API failed"