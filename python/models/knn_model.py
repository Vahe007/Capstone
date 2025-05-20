import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import GridSearchCV

data_path = 'datasets/heart_dataset.csv'
df = pd.read_csv(data_path)

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores_knn = cross_val_score(KNeighborsClassifier(),
                                X_train_scaled, y_train, cv=kf, scoring='accuracy')
print("\nKNN Classifier Cross-Validation Accuracy (k=5):", cv_scores_knn)
print("Mean Accuracy:", np.mean(cv_scores_knn))

param_grid = {
    'n_neighbors': [3, 5, 7, 9, 11],
    'weights': ['uniform', 'distance'],
    'p': [1, 2]
}

grid_search = GridSearchCV(KNeighborsClassifier(),
                           param_grid,
                           cv=kf,
                           scoring='accuracy',
                           n_jobs=-1)

grid_search.fit(X_train_scaled, y_train)
print("Best Hyperparameters:", grid_search.best_params_)
print("Grid search best params of the model", grid_search.best_estimator_)

knn_model = grid_search.best_estimator_
knn_model.fit(X_train_scaled, y_train)
y_pred_knn = knn_model.predict(X_test_scaled)

report_dict = classification_report(y_test, y_pred_knn, output_dict=True)
conf_matrix = confusion_matrix(y_test, y_pred_knn).tolist()
accuracy = accuracy_score(y_test, y_pred_knn)

report_dict.pop("accuracy", None)

for key, value in report_dict.items():
    if isinstance(value, dict) and "support" in value:
        value["support"] = int(value["support"])

metrics = {
    "model_name": "knn_model",
    "accuracy": round(accuracy, 2),
    "classification_report": report_dict,
    "confusion_matrix": conf_matrix
}

os.makedirs("trained_models", exist_ok=True)
with open("trained_models/knn_metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)

joblib.dump(knn_model, 'trained_models/knn_model.joblib')
joblib.dump(scaler, 'trained_models/knn_scaler.joblib')
