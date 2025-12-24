from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Dict, Any, List
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

import os

# Resolve path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'rf_baseline.joblib')

from contextlib import asynccontextmanager

model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    # Load model on startup
    data = joblib.load(MODEL_PATH)
    model = data['model_pipeline']
    yield
    # Clean up on shutdown if needed

app = FastAPI(title='CareerGPS ML Inference', lifespan=lifespan)
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

@app.post('/predict')
def predict(s: Survey):
    # Convert incoming survey to model features
    row = {}
    # interests
    for k, v in s.interests.items():
        row[f'int_{k}'] = int(bool(v))
    # confidences
    for k, v in s.confidence.items():
        row[f'conf_{k}'] = int(v)
    # workStyle
    for k, v in s.workStyle.items():
        row[f'ws_{k}'] = v
    # intent
    for k, v in s.intent.items():
        row[f'intent_{k}'] = v

    import pandas as pd
    X = pd.DataFrame([row])

    probs = model.predict_proba(X)[0]
    classes = list(model.classes_)

    # get top 3
    idx = np.argsort(probs)[::-1][:3]
    results = []
    for i in idx:
        results.append({'career': classes[i], 'prob': float(probs[i])})

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
