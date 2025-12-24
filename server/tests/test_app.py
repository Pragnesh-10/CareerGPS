import sys, os
# ensure repo server path is on sys.path so tests can import `app`
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

SAMPLE = {
    "interests": {"numbers": True, "building": True, "design": False, "explaining": False, "logic": True},
    "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
    "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
    "confidence": {"math": 7, "coding": 6, "communication": 5}
}


def test_predict_returns_200_and_predictions():
    with TestClient(app) as client:
        res = client.post('/predict', json=SAMPLE)
        assert res.status_code == 200
        body = res.json()
        assert 'predictions' in body
        assert isinstance(body['predictions'], list)
        assert len(body['predictions']) >= 1
        # Each prediction should have career & prob
        p = body['predictions'][0]
        assert 'career' in p and 'prob' in p
