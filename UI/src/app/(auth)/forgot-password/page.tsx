import React from "react";
import type { Metadata } from "next";
import ForgotPassword from "@/components/auth/forgotPassword";

export const metadata: Metadata = {
  title: "Reset Password - HealthApp",
  description: "Reset your HealthApp account password.",
};

export default function ResetPasswordPage() {
  return <ForgotPassword />;
}
