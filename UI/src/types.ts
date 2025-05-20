import { z } from "zod";

export interface ClassificationReportMetrics {
  precision: number;
  recall: number;
  "f1-score": number;
  support: number;
}

export interface ClassificationReportData {
  [className: string]: ClassificationReportMetrics;
}

export interface PredictionApiResponse {
  model_name: string;
  accuracy: number;
  classification_report: ClassificationReportData;
  confusion_matrix: [[number, number], [number, number]];
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: "number" | "select";
  options?: SelectOption[];
  validation: z.ZodTypeAny;
}

export type FeaturesType = {
  age: number;
  ca: number;
  chol: number;
  cp: number;
  exang: number;
  fbs: number;
  oldpeak: number;
  restecg: number;
  sex: number;
  slope: number;
  thal: number;
  thalach: number;
  trestbps: number;
};

export type ModelPredicitonRequestInput = {
  features: FeaturesType;
  model_type: string;
};

export type DiagnosisResult = {
  requestInput: FeaturesType;
  mlPredictionResult: number;
  mlModelUsed: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  medicalData?: string[];
  hasHeartDisease?: number;
  isVerified?: boolean;
};
