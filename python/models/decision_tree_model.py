import joblib
import json
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.model_selection import GridSearchCV


data_path = 'datasets/heart_dataset.csv'
df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)
print("Dataset columns:", df.columns)
print("First few rows:\n", df.head())

print("Missing values:\n", df.isnull().sum())

X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores_dt = cross_val_score(DecisionTreeClassifier(random_state=42),
                               X_train_scaled, y_train, cv=kf, scoring='accuracy')
print("\nDecision Tree Cross-Validation Accuracy (k=5):", cv_scores_dt)
print("Mean Accuracy:", np.mean(cv_scores_dt))


param_grid = {
    'criterion': ['gini', 'entropy'],
    'max_depth': [None, 5, 10, 15, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 5]
}

grid_search = GridSearchCV(DecisionTreeClassifier(random_state=42),
                           param_grid,
                           cv=kf,
                           scoring='accuracy',
                           n_jobs=-1)

grid_search.fit(X_train_scaled, y_train)
print("Best Hyperparameters:", grid_search.best_params_)
print("Grid search best params of the decision tree:", grid_search.best_estimator_)


dt_model = DecisionTreeClassifier(**grid_search.best_params_, random_state=42)
dt_model.fit(X_train_scaled, y_train)

y_pred_dt = dt_model.predict(X_test_scaled)

report_dict = classification_report(y_test, y_pred_dt, output_dict=True)
conf_matrix = confusion_matrix(y_test, y_pred_dt).tolist()
accuracy = accuracy_score(y_test, y_pred_dt)

report_dict.pop("accuracy", None)

for key, value in report_dict.items():
    if isinstance(value, dict) and "support" in value:
        value["support"] = int(value["support"])

metrics = {
    "model_name": "decision_tree",
    "accuracy": round(accuracy, 2),
    "classification_report": report_dict,
    "confusion_matrix": conf_matrix
}

os.makedirs("trained_models", exist_ok=True)
with open("trained_models/decision_tree_metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)


joblib.dump(dt_model, 'trained_models/decision_tree_model.joblib')
joblib.dump(scaler, 'trained_models/decision_tree_scaler.joblib')

with open("trained_models/decision_tree_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

