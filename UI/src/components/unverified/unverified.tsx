"use client";

import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";
import React, { useState } from "react";

export default function Unverified() {
  const { user } = useUserSession();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );

  const handleResendVerification = async () => {
    setIsSending(true);
    setMessage("");
    setMessageType(null);

    console.log("user is user", user);

    if (!user?.email) {
      setIsSending(false);
      return setMessageType("error");
    }

    const response = await fetch("/api/sendVerificationEmail", {
      method: "POST",
      body: JSON.stringify({
        email: user?.email,
      }),
    });

    const data = await response.json();

    console.log("response is response", response);
    console.log("data is data", response);

    if (response.status === 200) {
      setMessageType("success");
      setMessage(
        "Verification email sent successfully! Please check your inbox (and spam folder).",
      );
      setIsSending(false);
      return;
    }

    setMessageType("error");
    setMessage(data?.error || "Error");
    setIsSending(false);
  };

  return (
    <>
      {/* <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold text-blue-600">HealthApp</a>
                    <nav>
                        <a href="/profile" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Profile</a>
                        <button onClick={() => alert('Logout functionality to be implemented')} className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Logout
                        </button>
                    </nav>
                </div>
            </header> */}

      <main className="flex-grow flex items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-lg w-full bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl border border-slate-200 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-amber-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.023.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            Verify Your Email Address
          </h1>
          <p className="text-slate-600 mb-6 text-sm sm:text-base">
            To complete your HealthApp registration and access all features,
            please verify your email address. We&apos;ve sent a verification
            link to the email you provided during sign-up.
          </p>
          <p className="text-slate-500 mb-8 text-xs sm:text-sm">
            If you didn&apos;t receive the email, please check your spam folder
            or click the button below to resend it.
          </p>

          {message && (
            <div
              className={`p-3 rounded-md text-sm mb-6 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : messageType === "error"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleResendVerification}
            disabled={isSending}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
          >
            {isSending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </button>
        </div>
      </main>
    </>
  );
}
