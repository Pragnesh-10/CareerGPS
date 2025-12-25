
import joblib
import numpy as np
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, Int64TensorType
import onnx
import os

def convert():
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'rf_baseline.joblib')
    output_path = os.path.join(os.path.dirname(__file__), 'models', 'rf_baseline.onnx')
    
    print(f"Loading model from {model_path}...")
    data = joblib.load(model_path)
    model_pipeline = data['model_pipeline']
    
    # We need to define the input type for ONNX.
    # The pipeline starts with a DictVectorizer (sparse=False). 
    # ONNX conversion for DictVectorizer usually expects a dictionary or specific inputs.
    # However, skl2onnx has support for Pipelines. 
    # But standard sklearn DictVectorizer support in ONNX might be tricky if inputs vary.
    # Let's check what the pipeline expects.
    # Pipeline: DictVectorizer -> RandomForest
    
    # In `app.py`, we construct a list of dicts: `X = [row]`
    # Sklearn's DictVectorizer takes a list of dicts.
    # skl2onnx usually requires defined initial types.
    # "The converter for DictVectorizer expects a dictionary input if it's the first step."
    # BUT, actually, it's often easier to convert just the classifier if we can handle the vectorization separately,
    # OR convert the whole pipeline if we define the input correctly.
    
    # Let's inspect the DictVectorizer to see the feature names it expects.
    vect = model_pipeline.named_steps['vect']
    feature_names = vect.get_feature_names_out()
    print(f"Model has {len(feature_names)} features.")
    
    # If we convert the *whole* pipeline, we need to handle the input type 'List[Dict]'.
    # ONNX doesn't natively support arbitrary Python dictionaries.
    
    # STRATEGY CHANGE:
    # It is significantly easier and more robust to pre-compute the features (vectorization) in Python (it's lightweight)
    # and only perform the heavy RandomForest inference in ONNX.
    # The DictVectorizer is just a mapping of keys to indices. We can extract this mapping.
    
    # Let's see if we can save just the RandomForest part to ONNX, 
    # and we'll handle the DictVectorizer in pure Python in app.py.
    
    rf_model = model_pipeline.named_steps['rf']
    
    # The input to RF is a float array of shape (N, num_features)
    initial_type = [('float_input', FloatTensorType([None, len(feature_names)]))]
    
    print("Converting RandomForest to ONNX...")
    onx = convert_sklearn(rf_model, initial_types=initial_type, target_opset=12)
    
    with open(output_path, "wb") as f:
        f.write(onx.SerializeToString())
    
    print(f"Saved ONNX model to {output_path}")
    
    # We also need to save the vocabulary/mapping so `app.py` can vectorize correctly.
    # DictVectorizer stores `vocabulary_` (dict of feature->index) if trained, 
    # but `sparse=False` DictVectorizer creates a dense array.
    # Let's save the feature names list to a JSON for easy loading.
    
    import json
    vocab_path = os.path.join(os.path.dirname(__file__), 'models', 'model_features.json')
    with open(vocab_path, 'w') as f:
        json.dump(feature_names.tolist(), f)
    print(f"Saved feature mapping to {vocab_path}")

if __name__ == "__main__":
    convert()
