from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Dict, Any, List
import numpy as np
import onnxruntime as ort
import json
import os
from fastapi.middleware.cors import CORSMiddleware

# Resolve path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'rf_baseline.onnx')
FEATURES_PATH = os.path.join(BASE_DIR, 'models', 'model_features.json')

model_session = None
feature_map = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model_session, feature_map
    try:
        # Load ONNX model
        model_session = ort.InferenceSession(MODEL_PATH)
        
        # Load feature mapping
        with open(FEATURES_PATH, 'r') as f:
            features_list = json.load(f)
            feature_map = {name: i for i, name in enumerate(features_list)}
            
        print(f"Loaded ONNX model and {len(feature_map)} features.")
    except Exception as e:
        print(f"Error loading model: {e}")
        # Consider whether to fail startup or allow running without model
        pass
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
    if model_session is None:
        return {'error': 'Model not loaded'}

    # 1. Construct raw dictionary (matching training logic)
    raw_row = {}
    # interests
    for k, v in s.interests.items():
        raw_row[f'int_{k}'] = int(bool(v))
    # confidences
    for k, v in s.confidence.items():
        raw_row[f'conf_{k}'] = int(v)
    # workStyle
    for k, v in s.workStyle.items():
        raw_row[f'ws_{k}'] = v
    # intent
    for k, v in s.intent.items():
        raw_row[f'intent_{k}'] = v

    # 2. Vectorize (Manual DictVectorizer)
    num_features = len(feature_map)
    input_vector = np.zeros((1, num_features), dtype=np.float32)
    
    for k, v in raw_row.items():
        if isinstance(v, str):
            # Categorical string feature: becomes key=value
            feat_name = f"{k}={v}"
            val = 1.0
        else:
            # Numeric feature: keep key
            feat_name = k
            val = float(v)
            
        if feat_name in feature_map:
            idx = feature_map[feat_name]
            input_vector[0, idx] = val

    # 3. Inference
    input_name = model_session.get_inputs()[0].name
    # Output structure: [label, probabilities_map] (zipmap=True default)
    # or [label, probabilities_tensor] (if zipmap=False)
    
    try:
        # Run inference
        outputs = model_session.run(None, {input_name: input_vector})
        
        # outputs[0] is the predicted label
        # outputs[1] is the probability map (list of dicts)
        probs_map = outputs[1][0] # Dict[label, probability]
        
        # Sort by probability
        sorted_probs = sorted(probs_map.items(), key=lambda item: item[1], reverse=True)
        
        # Get top 3
        top3 = sorted_probs[:3]
        results = [{'career': k, 'prob': float(v)} for k, v in top3]
        
        return {'predictions': results}
        
    except Exception as e:
        print(f"Inference error: {e}")
        return {'error': str(e)}

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
