import pandas as pd
from typing import Dict, List, Optional

def load_and_preprocess_data(
    file_path: str,
    column_names: List[str],
    has_header: bool,
    mappings: Dict[str, Dict[int, str]]
    ) -> Optional[pd.DataFrame]:

    try:
        if has_header:
            df = pd.read_csv(file_path)
        else:
            df = pd.read_csv(file_path, header=None, names=column_names)


        df.columns = [str(col).lower().replace(' ', '_').replace('.', '') for col in df.columns]

        df.replace('?', pd.NA, inplace=True)

        potential_numeric_cols = [
            'age', 'resting_bp_s', 'cholesterol', 'max_heart_rate',
            'oldpeak', 'sex', 'chest_pain_type', 'fasting_blood_sugar',
            'resting_ecg', 'exercise_angina', 'st_slope', 'target'
        ]
        for col in potential_numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

       
        for feature, feature_map in mappings.items():
            label_col = f"{feature}_label"
            print(f"label col is {label_col}")
            if feature in df.columns:
                if pd.api.types.is_numeric_dtype(df[feature]):
                     df[label_col] = df[feature].map(feature_map).fillna('unknown')
                else:
                     print(f"Warning: Column '{feature}' is not numeric, cannot apply mapping directly. Skipping.")
            if feature == 'target' and 'target' in df.columns:
                 df['diagnosis_code'] = df['target'].apply(lambda x: 1 if pd.notna(x) and x > 0 else 0 if pd.notna(x) and x == 0 else -1)
                 df['diagnosis_label'] = df['diagnosis_code'].apply(lambda x: feature_map.get(x, 'unknown diagnosis'))


        if 'target' not in df.columns:
            df['diagnosis_code'] = -1
            df['diagnosis_label'] = 'unknown diagnosis'

        return df

    except Exception as e:
        print(f"Error loading or preprocessing data: {e}")
        raise

