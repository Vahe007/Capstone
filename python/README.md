# Heart Disease Risk Prediction (FastAPI)

This repository is part of a full-stack health tech application that helps users assess the risk of heart disease based on medical data. It exposes multiple machine learning models as API endpoints using **FastAPI**.

## 📦 Features

- Multiple ML models available (Logistic Regression, SVM, Decision Tree, KNN)
- Model training, testing, and hyperparameter optimization
- Saved metrics for each trained model (accuracy, confusion matrix, classification report)
- Swagger UI for easy API testing
- Embedding-based case similarity using OpenAI + Qdrant (for initial diagnosis)

## 📁 Project Structure

├── datasets/ # CSV data files for training and testing
├── fastAPI/
│ ├── main.py # Main FastAPI application
│ ├── classes.py
│ ├── model_metrics.py
├── vector # Contains all the embeding logic and communication with Qdrant cluster
├── trained_models/ # Saved models and scalers (after training)
├── models/ # Creation and save logic of the models
└── requirements.txt # Python dependencies



## 🚀 Running the Project

1. **Install dependencies**  
   It's recommended to use a virtual environment.

   ```bash
   pip install -r requirements.txt


2. **Running the FAST API**  
    Project will run on localhost:8000
    For accessing the swagger - navigate to http://localhost:8000/docs

   ```bash
   fastapi dev fastAPI/main.py


## 🚀 Running the Project


