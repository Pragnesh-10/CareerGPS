import os
import sys
import json
import tempfile
import subprocess


def make_small_jsonl(path):
    samples = [
        {
            "interests": {"numbers": True, "building": False, "design": False, "explaining": False, "logic": True},
            "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
            "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
            "confidence": {"math": 7, "coding": 6, "communication": 5},
            "label": "Data Scientist"
        },
        {
            "interests": {"numbers": True, "building": False, "design": False, "explaining": True, "logic": True},
            "workStyle": {"environment": "Team", "structure": "Flexible", "roleType": "Dynamic"},
            "intent": {"afterEdu": "higherStudies", "workplace": "corporate", "nature": "research"},
            "confidence": {"math": 8, "coding": 5, "communication": 7},
            "label": "Data Scientist"
        },
        {
            "interests": {"numbers": False, "building": True, "design": False, "explaining": False, "logic": True},
            "workStyle": {"environment": "Solo", "structure": "Structured", "roleType": "Desk Job"},
            "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
            "confidence": {"math": 4, "coding": 8, "communication": 5},
            "label": "Backend Developer"
        },
        {
            "interests": {"numbers": False, "building": True, "design": True, "explaining": False, "logic": False},
            "workStyle": {"environment": "Team", "structure": "Flexible", "roleType": "Dynamic"},
            "intent": {"afterEdu": "job", "workplace": "startup", "nature": "applied"},
            "confidence": {"math": 3, "coding": 7, "communication": 6},
            "label": "Backend Developer"
        }
    ]
    samples = samples * 2  # Duplicate to have 8 samples total
    with open(path, 'w') as f:
        for s in samples:
            f.write(json.dumps(s) + '\n')


def test_train_saves_model(tmp_path):
    data_path = tmp_path / 'bootstrap.jsonl'
    model_path = tmp_path / 'model.joblib'
    make_small_jsonl(str(data_path))

    # Run training script
    res = subprocess.run([sys.executable, 'ml/train.py', '--input', str(data_path), '--out', str(model_path), '--test-size', '0.5', '--cv-folds', '2', '--n-jobs', '1'], cwd=os.path.join(os.getcwd()), capture_output=True, text=True)
    assert res.returncode == 0, f"Training script failed: {res.stdout}\n{res.stderr}"
    assert model_path.exists()
