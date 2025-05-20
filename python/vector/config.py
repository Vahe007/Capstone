import os
from dotenv import load_dotenv
from qdrant_client.http.models import Distance

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

CSV_FILE_PATH = '/Users/vahemanukyan/Desktop/capstone/project/datasets/heart_statlog_cleveland_hungary_final.csv'

CSV_COLUMN_NAMES = [
    'age', 'sex', 'chest pain type', 'resting bp s', 'cholesterol',
    'fasting blood sugar', 'resting ecg', 'max heart rate', 'exercise angina',
    'oldpeak', 'ST slope', 'target'
]
HAS_HEADER = True

COLLECTION_NAME = "heart_disease_cases"
EMBEDDING_MODEL = "text-embedding-ada-002"
VECTOR_SIZE = 1536
DISTANCE_METRIC = Distance.COSINE

QDRANT_BATCH_SIZE = 100
EMBEDDING_MAX_RETRIES = 3
EMBEDDING_RETRY_DELAY = 5

SEX_MAP = {0: 'female', 1: 'male'}
CP_MAP = {
    1: 'typical angina', 2: 'atypical angina', 3: 'non-anginal pain', 4: 'asymptomatic'
}
FBS_MAP = {0: 'less than or equal to 120 mg/dl', 1: 'greater than 120 mg/dl'}
RESTECG_MAP = {
    0: 'normal',
    1: 'ST-T wave abnormality (T wave inversions and/or ST elevation or depression of > 0.05 mV)',
    2: 'probable or definite left ventricular hypertrophy by Estes criteria'
}
EXANG_MAP = {0: 'no', 1: 'yes'}
SLOPE_MAP = {
    1: 'upsloping', 2: 'flat', 3: 'downsloping'
}
TARGET_MAP = {0: 'no heart disease', 1: 'heart disease'}

ALL_MAPPINGS = {
    'sex': SEX_MAP,
    'chest_pain_type': CP_MAP,
    'fasting_blood_sugar': FBS_MAP,
    'resting_ecg': RESTECG_MAP,
    'exercise_angina': EXANG_MAP,
    'st_slope': SLOPE_MAP,
    'target': TARGET_MAP
}

if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY environment variable not set.")
if not QDRANT_URL:
    print("Warning: QDRANT_URL environment variable not set.")

