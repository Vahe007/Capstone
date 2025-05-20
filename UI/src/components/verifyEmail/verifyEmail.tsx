"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { renderIcon } from "./helpers";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);
  const [message, setMessage] = useState(
    "Verifying your email, please wait...",
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage(
        "Verification token is missing or invalid. Please try the link again or request a new one.",
      );
      setVerificationStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        setVerificationStatus(null);
        const response = await fetch(`/api/verify-email?token=${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.status === 200) {
          router.push("/prediction-analysis");
          return;
        }
        setVerificationStatus("error");
        setMessage(data.error);
      } catch (error) {
        setVerificationStatus("error");
        setMessage("Account verification failed");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="max-w-lg w-full bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl border border-slate-200 text-center">
      <div className="mb-6">{renderIcon(verificationStatus)}</div>

      <h1
        className={`text-2xl sm:text-3xl font-bold mb-4 ${
          verificationStatus === "success"
            ? "text-green-700"
            : verificationStatus === "error"
              ? "text-red-700"
              : "text-slate-800"
        }`}
      >
        {!verificationStatus && "Verifying Email..."}
        {verificationStatus === "success" && "Verification Successful!"}
        {verificationStatus === "error" && "Verification Failed"}
      </h1>

      <p className="text-slate-600 mb-8 text-sm sm:text-base">{message}</p>

      {verificationStatus === "success" && (
        <Link href="/login">Proceed to Login</Link>
      )}

      {verificationStatus === "error" && (
        <Link href="/verify-account">Request New Link</Link>
      )}
    </div>
  );
}
