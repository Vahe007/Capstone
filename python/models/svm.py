import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

data_path = 'datasets/heart_dataset.csv'
df = pd.read_csv(data_path)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores_svm = cross_val_score(SVC(), X_train_scaled, y_train, cv=kf, scoring='accuracy')
print("\nSVM Cross-Validation Accuracy (k=5):", cv_scores_svm)
print("Mean Accuracy:", np.mean(cv_scores_svm))

param_grid = {
    'C': [0.1, 1, 10],
    'kernel': ['linear', 'rbf', 'poly'],
    'gamma': ['scale', 'auto']
}

grid_search = GridSearchCV(SVC(), param_grid, cv=kf, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)
print("Best Hyperparameters:", grid_search.best_params_)
print("Grid search best model", grid_search.best_estimator_)

svm_model = grid_search.best_estimator_
svm_model.fit(X_train_scaled, y_train)
y_pred_svm = svm_model.predict(X_test_scaled)

report_dict = classification_report(y_test, y_pred_svm, output_dict=True)
conf_matrix = confusion_matrix(y_test, y_pred_svm).tolist()
accuracy = accuracy_score(y_test, y_pred_svm)

report_dict.pop("accuracy", None)

for key, value in report_dict.items():
    if isinstance(value, dict) and "support" in value:
        value["support"] = int(value["support"])

metrics = {
    "model_name": "svm_model",
    "accuracy": round(accuracy, 2),
    "classification_report": report_dict,
    "confusion_matrix": conf_matrix
}

os.makedirs("trained_models", exist_ok=True)
with open("trained_models/svm_metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)

joblib.dump(svm_model, 'trained_models/svm_model.joblib')
joblib.dump(scaler, 'trained_models/svm_scaler.joblib')
