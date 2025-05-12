import React from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/loginForm";

export const metadata: Metadata = {
  title: "Login - HealthApp",
  description: "Sign in to your HealthApp account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
