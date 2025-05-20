import pandas as pd

def generate_sentence(row: pd.Series) -> str:
    def fmt(value, default="unknown"):
        if pd.isna(value):
            return default
        if isinstance(value, float) and value.is_integer():
            return str(int(value))
        if isinstance(value, float):
             return str(round(value, 2))
        return str(value)

    parts = []
    parts.append(f"A {fmt(row.get('age'))}-year-old")
    parts.append(f"{fmt(row.get('sex_label'))}")
    parts.append("patient presented")
    parts.append(f"with {fmt(row.get('chest_pain_type_label'))} chest pain.")
    parts.append(f"Resting blood pressure was {fmt(row.get('resting_bp_s'))} mm Hg.")
    parts.append(f"Serum cholesterol was {fmt(row.get('cholesterol'))} mg/dl.")
    parts.append(f"Fasting blood sugar was {fmt(row.get('fasting_blood_sugar_label'))}.")
    parts.append(f"Resting ECG showed {fmt(row.get('restecg_label'))}.")
    parts.append(f"Maximum heart rate achieved was {fmt(row.get('max_heart_rate'))}.")
    parts.append(f"Exercise-induced angina was {fmt(row.get('exercise_angina_label'))}.")
    parts.append(f"ST depression (oldpeak) was {fmt(row.get('oldpeak'))}.")
    parts.append(f"Peak exercise ST segment slope was {fmt(row.get('st_slope_label'))}.")

    parts.append(f"The patient was diagnosed with {fmt(row.get('diagnosis_label', 'unknown diagnosis'))}.")

    return " ".join(filter(None, parts))

def create_payload(row: pd.Series, sentence: str) -> dict:
    payload = {
        "source_text": sentence,
        "diagnosis_label": row.get('diagnosis_label', 'unknown diagnosis'),
        "diagnosis_code": int(row['diagnosis_code']) if pd.notna(row.get('diagnosis_code')) else -1,
        "age": int(row['age']) if pd.notna(row.get('age')) else None,
        "sex": row.get('sex_label', 'unknown'),
        "chest_pain_type": row.get('chest_pain_type_label', 'unknown'),
        "resting_bp_s": float(row['resting_bp_s']) if pd.notna(row.get('resting_bp_s')) else None,
        "cholesterol": float(row['cholesterol']) if pd.notna(row.get('cholesterol')) else None,
        "fasting_blood_sugar": row.get('fasting_blood_sugar_label', 'unknown'),
        "resting_ecg": row.get('resting_ecg_label', 'unknown'),
        "max_heart_rate": float(row['max_heart_rate']) if pd.notna(row.get('max_heart_rate')) else None,
        "exercise_angina": row.get('exercise_angina_label', 'unknown'),
        "oldpeak": float(row['oldpeak']) if pd.notna(row.get('oldpeak')) else None,
        "st_slope": row.get('st_slope_label', 'unknown'),
    }

    return {k: (None if pd.isna(v) else v) for k, v in payload.items()}
