import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
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

cv_scores_lr = cross_val_score(LogisticRegression(random_state=42, max_iter=1000),
                               X_train_scaled, y_train, cv=kf, scoring='accuracy')
print("\nLogistic Regression Cross-Validation Accuracy (k=5):", cv_scores_lr)
print("Mean Accuracy:", np.mean(cv_scores_lr))


param_grid = {
    'C': [0.001, 0.01, 0.1, 0.5, 1, 10],
    'penalty': ['l1', 'l2'],
    'solver': ['liblinear']
}

grid_search = GridSearchCV(LogisticRegression(random_state=42, max_iter=1000),
                           param_grid,
                           cv=kf,
                           scoring='accuracy',
                           n_jobs=-1)

grid_search.fit(X_train_scaled, y_train)
print("\nBest Hyperparameters:", grid_search.best_params_)
print("Grid search best params of the coefficients", grid_search.best_estimator_)


log_reg = LogisticRegression(**grid_search.best_params_, random_state=42, max_iter=1000)
log_reg.fit(X_train_scaled, y_train)
y_pred_lr = log_reg.predict(X_test_scaled)


report_dict = classification_report(y_test, y_pred_lr, output_dict=True)
conf_matrix = confusion_matrix(y_test, y_pred_lr).tolist()
accuracy = accuracy_score(y_test, y_pred_lr)

report_dict.pop("accuracy", None)

for key, value in report_dict.items():
    if isinstance(value, dict) and "support" in value:
        value["support"] = int(value["support"])

metrics = {
    "model_name": "logistic_regression_model",
    "accuracy": round(accuracy, 2),
    "classification_report": report_dict,
    "confusion_matrix": conf_matrix
}

os.makedirs("trained_models", exist_ok=True)
with open("trained_models/logistic_regression_metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)


joblib.dump(scaler, 'trained_models/logistic_regression_scaler.joblib')
joblib.dump(log_reg, 'trained_models/logistic_regression_model.joblib')

