import React from "react";
import type { Metadata } from "next";
import SignupForm from "@/components/auth/signUpForm";

export const metadata: Metadata = {
  title: "Sign Up - HealthApp",
  description: "Create your HealthApp account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
