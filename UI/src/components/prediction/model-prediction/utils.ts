import { FeaturesType, FormFieldConfig } from "@/types";
import { z } from "zod";

export const EXPECTED_FEATURES = [
  "age",
  "sex",
  "cp",
  "trestbps",
  "chol",
  "fbs",
  "restecg",
  "thalach",
  "exang",
  "oldpeak",
  "slope",
];

export const cleanRow = (row: Record<string, any>): FeaturesType => {
  const cleaned: Record<string, any> = {};
  EXPECTED_FEATURES.forEach((key) => {
    if (key in row) {
      cleaned[key] = row[key];
    }
  });
  return cleaned as FeaturesType;
};
export const fieldsConfig: FormFieldConfig[] = [
  {
    name: "age",
    label: "Age (years)",
    type: "number",
    validation: z
      .number({
        required_error: "Age is required.",
        invalid_type_error: "Age must be a number.",
      })
      .min(0, "Age cannot be negative.")
      .max(120, "Age seems too high."),
  },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    options: [
      { value: "", label: "Select sex" },
      { value: 1, label: "Male" },
      { value: 0, label: "Female" },
    ],
    validation: z
      .number({
        required_error: "Sex is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(0)
      .max(1),
  },
  {
    name: "cp",
    label: "Chest Pain Type",
    type: "select",
    options: [
      { value: "", label: "Select chest pain type" },
      { value: 1, label: "Typical Angina" },
      { value: 2, label: "Atypical Angina" },
      { value: 3, label: "Non-anginal Pain" },
      { value: 4, label: "Asymptomatic" },
    ],
    validation: z
      .number({
        required_error: "Chest pain type is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(1)
      .max(4),
  },
  {
    name: "trestbps",
    label: "Resting Blood Pressure (mmHg)",
    type: "number",
    validation: z
      .number({
        required_error: "Resting BP is required.",
        invalid_type_error: "Resting BP must be a number.",
      })
      .min(50, "Too low")
      .max(300, "Too high"),
  },
  {
    name: "chol",
    label: "Cholesterol level measured in mg/dL",
    type: "number",
    validation: z
      .number({
        required_error: "Cholesterol is required.",
        invalid_type_error: "Cholesterol must be a number.",
      })
      .min(50)
      .max(600),
  },
  {
    name: "fbs",
    label: "Fasting Blood Sugar > 120 mg/dl",
    type: "select",
    options: [
      { value: "", label: "Select fasting blood sugar status" },
      { value: 1, label: "True (> 120 mg/dl)" },
      { value: 0, label: "False (<= 120 mg/dl)" },
    ],
    validation: z
      .number({
        required_error: "Fasting blood sugar status is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(0)
      .max(1),
  },
  {
    name: "restecg",
    label: "Resting ECG Results",
    type: "select",
    options: [
      { value: "", label: "Select resting ECG result" },
      { value: 0, label: "Normal" },
      { value: 1, label: "ST-T Wave Abnormality" },
      { value: 2, label: "Probable or Definite LVH" },
    ],
    validation: z
      .number({
        required_error: "Resting ECG result is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(0)
      .max(2),
  },
  {
    name: "thalach",
    label: "Max Heart Rate Achieved",
    type: "number",
    validation: z
      .number({
        required_error: "Max heart rate is required.",
        invalid_type_error: "Max heart rate must be a number.",
      })
      .min(60)
      .max(220),
  },
  {
    name: "exang",
    label: "Exercise Induced Angina",
    type: "select",
    options: [
      { value: "", label: "Select exercise angina status" },
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
    validation: z
      .number({
        required_error: "Exercise angina status is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(0)
      .max(1),
  },
  {
    name: "oldpeak",
    label: "Exercise ST Depression",
    type: "number",
    validation: z
      .number({
        required_error: "Oldpeak is required.",
        invalid_type_error: "Oldpeak must be a number.",
      })
      .min(0)
      .max(10),
  },
  {
    name: "slope",
    label: "Slope of Peak ST Segment",
    type: "select",
    options: [
      { value: "", label: "Select ST slope" },
      {
        value: 0,
        label: "Upsloping (Value 0 in some contexts, maps to Value 1 desc)",
      },
      {
        value: 1,
        label: "Flat (Value 1 in some contexts, maps to Value 2 desc)",
      },
      {
        value: 2,
        label: "Downsloping (Value 2 in some contexts, maps to Value 3 desc)",
      },
    ],
    validation: z
      .number({
        required_error: "Slope is required.",
        invalid_type_error: "Please select a valid option.",
      })
      .min(0)
      .max(2),
  },
];
