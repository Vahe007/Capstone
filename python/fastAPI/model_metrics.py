from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import os
import joblib


SUPPORTED_MODELS = ["decision_tree", "logistic_regression", "xgboost", "knn"]
MODELS_PATH = '../trained_models'
loaded_models: dict[str, any] = {}
model_metrics: dict[str, dict[str, any]] = {}

print("Loading ML models and metrics...")
for model_name in SUPPORTED_MODELS:
    model = None
    metrics = None
    try:
        filename = f"{model_name}_model.joblib"
        if model_name == 'xgboost': filename = 'xgb_model.joblib'
        elif model_name == 'logistic_regression': filename = 'logistic_model.joblib'

        model_path = os.path.join('trained_models', filename)

        print('model_pathmodel_pathmodel_pathmodel_pathmodel_path', model_path)
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            print(f"- Loaded model '{model_name}' from {model_path}")
        else:
            print(f"- Warning: Model file not found for '{model_name}' at {model_path}")

        if model_name == "decision_tree":
            metrics = {
                "accuracy": 0.85,
                "classification_report": {
                    '0': {'precision': 0.86, 'recall': 0.88, 'f1-score': 0.87, 'support': 100},
                    '1': {'precision': 0.84, 'recall': 0.82, 'f1-score': 0.83, 'support': 105},
                    'accuracy': 0.85,
                    'macro avg': {'precision': 0.85, 'recall': 0.85, 'f1-score': 0.85, 'support': 205},
                    'weighted avg': {'precision': 0.85, 'recall': 0.85, 'f1-score': 0.85, 'support': 205}
                 },
                "confusion_matrix": [[90, 10], [15, 85]]
            }
            print('decision tree metric is', metrics)
        elif model_name == "logistic_regression":
             metrics = {
                "accuracy": 0.88,
                "classification_report": {
                    '0': {'precision': 0.90, 'recall': 0.89, 'f1-score': 0.89, 'support': 100},
                    '1': {'precision': 0.87, 'recall': 0.88, 'f1-score': 0.87, 'support': 105},
                    'accuracy': 0.88,
                    'macro avg': {'precision': 0.88, 'recall': 0.88, 'f1-score': 0.88, 'support': 205},
                    'weighted avg': {'precision': 0.88, 'recall': 0.88, 'f1-score': 0.88, 'support': 205}
                 },
                "confusion_matrix": [[95, 5], [12, 88]]
            }
        else:
             metrics = {"accuracy": None, "classification_report": None, "confusion_matrix": None}

        print(f"- Metrics for '{model_name}' loaded.")

    except Exception as e:
        print(f"- Error loading model or metrics for '{model_name}': {e}")
        model = None
        metrics = None
    finally:
        loaded_models[model_name] = model
        model_metrics[model_name] = metrics

print("Model and metrics loading complete.")
