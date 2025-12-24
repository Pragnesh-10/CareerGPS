"""
Train a baseline classifier from the bootstrap JSONL dataset and save model + preprocessor.
Usage:
  python train.py --input ml/data/bootstrap.jsonl --out ml/models/rf_baseline.joblib

Produces a joblib file with keys: 'model' and 'preprocessor' (ColumnTransformer + label encoder)
"""

import argparse
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, top_k_accuracy_score, classification_report
import joblib
import os


def load_jsonl(path):
    rows = []
    with open(path, 'r') as f:
        for line in f:
            rows.append(json.loads(line))
    return rows


def prepare_df(rows):
    # Flatten structure
    recs = []
    for r in rows:
        row = {}
        # interests
        for k, v in r.get('interests', {}).items():
            row[f'int_{k}'] = int(bool(v))
        # confidences
        for k, v in r.get('confidence', {}).items():
            row[f'conf_{k}'] = int(v)
        # workStyle
        for k, v in r.get('workStyle', {}).items():
            row[f'ws_{k}'] = v
        # intent
        for k, v in r.get('intent', {}).items():
            row[f'intent_{k}'] = v
        row['label'] = r.get('label')
        recs.append(row)
    return pd.DataFrame(recs)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='ml/data/bootstrap.jsonl')
    parser.add_argument('--out', default='ml/models/rf_baseline.joblib')
    parser.add_argument('--test-size', type=float, default=0.2)
    parser.add_argument('--cv-folds', type=int, default=5, help='Number of cross-validation folds')
    parser.add_argument('--n-jobs', type=int, default=-1, help='Number of jobs for parallel processing')
    args = parser.parse_args()

    print(f"Loading data from {args.input}...")
    try:
        rows = load_jsonl(args.input)
    except FileNotFoundError:
        print(f"Error: input file {args.input} not found.")
        print("Please run 'node ml/generate_bootstrap.js' first.")
        return

    df = prepare_df(rows)
    print(f"Loaded {len(df)} samples.")

    X = df.drop(columns=['label'])
    y = df['label']

    # Categorical columns to one-hot
    categorical_cols = [c for c in X.columns if c.startswith('ws_') or c.startswith('intent_')]
    
    # Preprocessing pipeline
    preprocessor = ColumnTransformer([
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
    ], remainder='passthrough')

    # Base pipeline
    pipeline = Pipeline([
        ('pre', preprocessor),
        ('rf', RandomForestClassifier(random_state=42, n_jobs=args.n_jobs))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=args.test_size, random_state=42, stratify=y)
    
    # --- 1. Cross-Validation on default model ---
    print(f"Running {args.cv_folds}-fold Cross-Validation on default model...")
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=args.cv_folds, n_jobs=args.n_jobs)
    print(f"Mean CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

    # --- 2. Hyperparameter Tuning (GridSearchCV) ---
    print("Starting Hyperparameter Tuning (GridSearchCV)...")
    param_grid = {
        'rf__n_estimators': [50, 100, 200],
        'rf__max_depth': [None, 10, 20],
        'rf__min_samples_split': [2, 5],
        'rf__class_weight': [None, 'balanced']
    }
    
    grid_search = GridSearchCV(pipeline, param_grid, cv=args.cv_folds, n_jobs=args.n_jobs, verbose=1, scoring='accuracy')
    grid_search.fit(X_train, y_train)

    print(f"Best Parameters: {grid_search.best_params_}")
    best_model = grid_search.best_estimator_

    # --- 3. Final Evaluation ---
    print("Evaluating best model on Test Set...")
    preds = best_model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    
    # top-3 accuracy using predict_proba
    try:
        probs = best_model.predict_proba(X_test)
        top3 = top_k_accuracy_score(y_test, probs, k=3, labels=best_model.classes_)
    except Exception:
        top3 = None

    print(f'Test Set Accuracy: {acc:.4f}')
    if top3 is not None:
        print(f'Test Set Top-3 Accuracy: {top3:.4f}')
    
    print("\nClassification Report:\n")
    print(classification_report(y_test, preds))

    # --- 4. Save Model ---
    # We save the Best Estimator found by GridSearch
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    joblib.dump({'model_pipeline': best_model}, args.out)
    print(f'Saved best model to {args.out}')


if __name__ == '__main__':
    main()
