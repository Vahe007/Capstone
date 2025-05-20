import os
import joblib
import json
import vector.config as config
from fastapi import FastAPI, HTTPException, Body, Path
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from .model_metrics import model_metrics
from .classes import ModelMetricsResponse, ClassMetrics, InitialDiagnosisInput, InitialDiagnosisResponse
from vector.initial_diagnosis_service import InitialDiagnosisService
from vector.embedding_service import EmbeddingService
from vector.qdrant_service import QdrantService
from fastapi.responses import JSONResponse
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

class FeaturesDto(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    class Config:
        schema_extra = {
            "example": {
                "age": 40, "sex": 1, "cp": 2, "trestbps": 140, "chol": 289,
                "fbs": 0, "restecg": 0, "thalach": 172, "exang": 0,
                "oldpeak": 0.0, "slope": 1
            }
        }

class ModelPredictionRequest(BaseModel):
    features: FeaturesDto

class PredictionResponse(BaseModel):
    model_name: str
    prediction: int

app = FastAPI(
    title="Heart Disease Prediction API",
    description="Provides predictions using various custom ML models.",
    version="1.0.0",
)

SUPPORTED_MODELS = ["decision_tree", "logistic_regression", "svm", "knn"]
MODELS_PATH = 'trained_models'
loaded_models: Dict[str, Any] = {}

try: 
    openai_key=config.OPENAI_API_KEY
    embedding_model = config.EMBEDDING_MODEL

    embedding_service = EmbeddingService(api_key=openai_key, model=embedding_model)
    qdrant_service = QdrantService(
        url=config.QDRANT_URL,
        api_key=config.QDRANT_API_KEY,
        collection_name=config.COLLECTION_NAME,
        vector_size=config.VECTOR_SIZE,
        distance_metric=config.DISTANCE_METRIC
    )

    diagnosis_service = InitialDiagnosisService(
        embedding_service=embedding_service,
        qdrant_service=qdrant_service,
        openai_api_key=openai_key,
        model="gpt-4o"
    )
except Exception as e:
    print(f"FATAL: Failed to initialize services: {e}")


for model_name in SUPPORTED_MODELS:
    try:
        filename = f"{model_name}_model.joblib"

        model_path = os.path.join(MODELS_PATH, filename)
        if os.path.exists(model_path):
            loaded_models[model_name] = joblib.load(model_path)
        else:
            loaded_models[model_name] = None
    except Exception as e:
        loaded_models[model_name] = None


def prepare_features_for_model(features_dto: FeaturesDto) -> List[float]:
    feature_order = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope'
    ]
    try:
        feature_list = [getattr(features_dto, key) for key in feature_order]
        return feature_list
    except AttributeError as e:
         raise HTTPException(status_code=400, detail=f"Missing required feature: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing features.")


@app.get("/metrics/{model_name}", response_model=ModelMetricsResponse, tags=["Model Metrics"])
async def get_model_metrics(model_name: str):   
    
    metrics_path = f"trained_models/{model_name}_metrics.json"
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Metrics not found")

    with open(metrics_path, 'r') as f:
        metrics = json.load(f)
        

    return JSONResponse(metrics)


@app.post("/initialDiagnosis", response_model=InitialDiagnosisResponse, tags=["AI Diagnosis"])
async def get_initial_diagnosis_endpoint(data: InitialDiagnosisInput = Body(...)):
    if not diagnosis_service:
         raise HTTPException(status_code=503, detail="Diagnosis service is unavailable.")

    try:
        result = await diagnosis_service.get_initial_diagnosis(data.freestyle_text)
        text = result['result_text']
        context_texts = result['context_texts']

        if result is None:
            raise HTTPException(status_code=500, detail="Failed to generate initial diagnosis.")

        return InitialDiagnosisResponse(initial_diagnosis_text=text, similar_cases=context_texts)

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred during diagnosis.")



@app.post("/predict/{model_name}", response_model=PredictionResponse, tags=["ML Predictions"])
async def predict_with_model(
    model_name: str = Path(..., description=f"Name of the model to use. Supported: {', '.join(SUPPORTED_MODELS)}"),
    data: ModelPredictionRequest = Body(...)
):
    
    if model_name not in loaded_models or loaded_models[model_name] is None:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found or is unavailable.")

    selected_model = loaded_models[model_name]
    
    try:
        features_array = prepare_features_for_model(data.features)
        scaler = joblib.load(f"trained_models/{model_name}_scaler.joblib")
        scaled_features = scaler.transform([features_array])

        prediction = selected_model.predict(scaled_features)
        prediction_result = int(prediction[0])

        return PredictionResponse(model_name=model_name, prediction=prediction_result)

    except HTTPException as http_exc:
        print('error is error bro', http_exc)
        raise http_exc
    except Exception as e:
        print('error is error bro', e)
        raise HTTPException(status_code=500, detail=f"Error during prediction with model '{model_name}'.")
