import React from "react";
import type { Metadata } from "next";
import ModelPrediction from "@/components/prediction/model-prediction/MainPrediction";

export const metadata: Metadata = {
  title: "Sign Up - HealthApp",
  description: "Create your HealthApp account.",
};

export default function ModelPredictionPage() {
  return <ModelPrediction />;
}
