from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class MLFeaturesInput(BaseModel):
    features: List[float] = Field(..., example=[40.0, 1.0, 2.0, 140.0, 289.0, 0.0, 0.0, 172.0, 0.0, 0.0, 1.0])

class InitialDiagnosisInput(BaseModel):
    freestyle_text: str = Field(..., example="60 year old man with chest tightness when walking uphill")

class PredictionResponse(BaseModel):
    model_name: str
    prediction: int

class InitialDiagnosisResponse(BaseModel):
    initial_diagnosis_text: str


class PredictionResponse(BaseModel):
    model_name: str
    prediction: int
    accuracy: Optional[float] = None
    f1_score: Optional[float] = None
    confusion_matrix: Optional[Any] = None


class ClassMetrics(BaseModel):
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = Field(None, alias='f1-score')
    support: Optional[int] = None

    class Config:
        allow_population_by_field_name = True

class ModelMetricsResponse(BaseModel):
    model_name: str
    accuracy: Optional[float] = None
    classification_report: Optional[Dict[str, ClassMetrics]] = None
    confusion_matrix: Optional[List[List[int]]] = None

class Config:
        allow_population_by_field_name = True
        
        
class InitialDiagnosisInput(BaseModel):
    freestyle_text: str = Field(..., example="60 year old man with chest tightness when walking uphill")

class InitialDiagnosisResponse(BaseModel):
    initial_diagnosis_text: str
    similar_cases: list
