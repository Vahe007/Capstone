import { FeaturesType } from "@/types";

export function getInputSummary(input: FeaturesType): string {
  const sexMap: Record<number, string> = { 1: "male", 0: "female" };
  const cpMap: Record<number, string> = {
    1: "typical chest pain",
    2: "atypical chest pain",
    3: "non-heart chest pain",
    4: "no chest pain",
  };
  const fbsMap: Record<number, string> = {
    1: "high",
    0: "normal",
  };
  const ecgMap: Record<number, string> = {
    0: "normal ECG",
    1: "ECG with minor issues",
    2: "ECG showing heart strain",
  };
  const anginaMap: Record<number, string> = { 0: "no", 1: "yes" };
  const slopeMap: Record<number, string> = {
    1: "uphill",
    2: "flat",
    3: "downhill",
  };
  const thalMap: Record<number, string> = {
    1: "normal blood flow",
    2: "permanent defect",
    3: "temporary defect",
  };

  return `A ${input.age}-year-old ${sexMap[input.sex]} with ${cpMap[input.cp]}. 
BP: ${input.trestbps} mmHg, Cholesterol: ${input.chol} mg/dL, 
Blood sugar: ${fbsMap[input.fbs]}, ECG: ${ecgMap[input.restecg]}, 
Max heart rate: ${input.thalach} bpm, Angina on exercise: ${anginaMap[input.exang]}, 
ST depression: ${input.oldpeak}, ST slope: ${slopeMap[input.slope]}.`;
}
