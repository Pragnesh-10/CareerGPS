from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, List
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

MODEL_PATH = 'models/rf_baseline.joblib'

app = FastAPI(title='CareerGPS ML Inference')
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

@app.on_event('startup')
def load_model():
    global model
    data = joblib.load(MODEL_PATH)
    model = data['model_pipeline']

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
