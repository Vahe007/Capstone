import React from "react";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/resetPassword";

export const metadata: Metadata = {
  title: "Reset Password - HealthApp",
  description: "Reset your HealthApp account password.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
