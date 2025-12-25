from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, List
from fastapi.middleware.cors import CORSMiddleware
import os

# Resolve path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(title='CareerGPS Prediction (Rule-Based)')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Survey(BaseModel):
    interests: Dict[str, bool]
    workStyle: Dict[str, Any]
    intent: Dict[str, Any]
    confidence: Dict[str, int]

# --- Rule-Based Knowledge Base ---

CAREER_PROFILES = {
    "Data Scientist": {
        "keywords": ["math", "logic", "numbers", "research", "explaining"],
        "bonus": {"nature": "research", "roleType": "Desk Job"}
    },
    "Frontend Developer": {
        "keywords": ["design", "building", "coding", "art"],
        "bonus": {"nature": "creative", "roleType": "Desk Job"}
    },
    "Backend Developer": {
        "keywords": ["logic", "building", "coding", "numbers"],
        "bonus": {"nature": "applied", "roleType": "Desk Job"}
    },
    "Product Manager": {
        "keywords": ["communication", "explaining", "leadership", "people", "business"],
        "bonus": {"nature": "management", "roleType": "Meetings"}
    },
    "UX/UI Designer": {
        "keywords": ["design", "art", "psychology", "communication"],
        "bonus": {"nature": "creative", "roleType": "Desk Job"}
    }
}

@app.post('/predict')
def predict(s: Survey):
    scores = {career: 0.0 for career in CAREER_PROFILES}

    # 1. Interest Scoring
    for interest, active in s.interests.items():
        if active:
            for career, profile in CAREER_PROFILES.items():
                if interest in profile["keywords"]:
                    scores[career] += 1.0

    # 2. Confidence Scoring (Weighted)
    for skill, level in s.confidence.items():
        # High confidence (6+) boosts related careers
        if level >= 6:
            for career, profile in CAREER_PROFILES.items():
                if skill in profile["keywords"]:
                    scores[career] += 0.5  # Boost for skill confidence

    # 3. Work Style/Intent Bonus
    for career, profile in CAREER_PROFILES.items():
        bonus = profile["bonus"]
        # Check intent nature
        if "nature" in s.intent and s.intent["nature"] == bonus.get("nature"):
            scores[career] += 1.0
        # Check role type
        if "roleType" in s.workStyle and s.workStyle["roleType"] == bonus.get("roleType"):
            scores[career] += 0.5

    # Sort results
    sorted_careers = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    
    # Normalize approx probability (softmax-ish or just ratio)
    total_score = sum(score for _, score in sorted_careers) or 1
    
    results = []
    for career, score in sorted_careers[:3]:
        prob = round(score / total_score, 2) if total_score > 0 else 0.0
        results.append({'career': career, 'prob': prob})

    return {'predictions': results}

VISITOR_FILE = os.path.join(BASE_DIR, 'visitor_count.txt')

@app.get('/visitor-count')
def visitor_count():
    count = 0
    if os.path.exists(VISITOR_FILE):
        try:
            with open(VISITOR_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    count = int(content)
        except Exception:
            pass # fallback to 0 if error

    count += 1
    
    try:
        # Note: On Vercel (serverless), local file writes are ephemeral.
        # This count will reset frequently. For permanent storage, use Vercel KV or a database.
        with open(VISITOR_FILE, 'w') as f:
            f.write(str(count))
    except (OSError, PermissionError):
        # Gracefully handle read-only file systems
        pass
    except Exception:
        pass 

    return {'count': count}
