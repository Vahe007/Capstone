import React from "react";
import type { Metadata } from "next";
import ModelPrediction from "@/components/prediction/MainPrediction";

export const metadata: Metadata = {
  title: "Sign Up - HealthApp",
  description: "Create your HealthApp account.",
};

export default function SignupPage() {
  return <ModelPrediction />;
}
