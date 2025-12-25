import sys, os
from unittest.mock import patch, MagicMock
import json
import numpy as np
# ensure repo server path is on sys.path so tests can import `app`
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from app import app

# Create a mock features list
MOCK_FEATURES = ["int_numbers", "int_building", "conf_math", "conf_coding"]

SAMPLE = {
    "interests": {"numbers": True, "building": True, "design": False, "explaining": False, "logic": True},
    "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
    "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
    "confidence": {"math": 7, "coding": 6, "communication": 5}
}

def test_predict_returns_200_and_predictions():
    # Mock ONNX session
    mock_session = MagicMock()
    # Mock get_inputs
    mock_input = MagicMock()
    mock_input.name = "input"
    mock_session.get_inputs.return_value = [mock_input]
    
    # Mock run output: [label, probabilities_map]
    # probabilities_map is a list of dicts (one per sample)
    mock_probs = [{"Data Scientist": 0.8, "Backend Developer": 0.15, "UI/UX Designer": 0.05}]
    mock_session.run.return_value = ["Data Scientist", mock_probs]

    # Mock file reading for model_features.json
    # We need to handle both `open(MODEL_PATH)` (implicitly by ort) and `open(FEATURES_PATH)`
    # Since we mock `ort.InferenceSession`, we just need to mock the feature loading.
    
    with patch('onnxruntime.InferenceSession', return_value=mock_session):
        # We need to mock builtins.open ONLY for the features.json load inside lifespan
        # It's tricky to mock open selectively. But we can mock `json.load` if valid, 
        # or mock `app.FEATURES_PATH` but that's a constant.
        
        # Better: mock the `open` call in app.py context or just mock the file content.
        with patch('builtins.open', new_callable=MagicMock) as mock_open:
            # Setup mock file reading
            mock_file = MagicMock()
            mock_file.__enter__.return_value = mock_file
            mock_open.return_value = mock_file
            
            # When json.load is called on the file handle, return our list
            # We can also just patch json.load
            with patch('json.load', return_value=MOCK_FEATURES):
                with TestClient(app) as client:
                    # Logic: client startup triggers lifespan -> loads model & features
                    res = client.post('/predict', json=SAMPLE)
                    
                    assert res.status_code == 200
                    body = res.json()
                    
                    if 'error' in body:
                        print(f"Server error: {body['error']}")
                        
                    assert 'predictions' in body
                    assert isinstance(body['predictions'], list)
                    assert len(body['predictions']) >= 1
                    
                    # Each prediction should have career & prob
                    p = body['predictions'][0]
                    assert 'career' in p and 'prob' in p
                    assert p['career'] == 'Data Scientist'
                    assert p['prob'] == 0.8
