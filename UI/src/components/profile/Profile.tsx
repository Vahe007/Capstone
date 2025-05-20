"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";
import { DiagnosisResult } from "@/types";
import { getInputSummary } from "./utils";

const ResetPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." })
      .regex(/\d/, {
        message: "New password must contain at least one number.",
      })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
        message: "New password must contain at least one special character.",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match.",
    path: ["confirmNewPassword"],
  });
type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

type SavedDiagnosis = {
  date: string;
  modelUsed: string;
  inputSummary: string;
  prediction: string;
  accuracy?: string;
};

export default function Profile() {
  const { user } = useUserSession();
  const [savedDiagnoses, setSavedDiagnoses] = useState<SavedDiagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetMessage, setResetMessage] = useState("");
  const [resetMessageType, setResetMessageType] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    setIsLoading(false);
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/predictions/diagnosis");

        const data = await response.json();

        if (response.status === 200) {
          const diagnoses: DiagnosisResult[] = data.diagnosis;
          setSavedDiagnoses(
            diagnoses.map((diagnosis) => ({
              date: diagnosis.createdAt,
              modelUsed: diagnosis.mlModelUsed,
              prediction: `User is at the ${diagnosis.mlPredictionResult === 1 ? "High Risk" : "Low Risk"}`,
              inputSummary: getInputSummary(diagnosis.requestInput),
            })),
          );
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handlePasswordResetSubmit = async (
    values: ResetPasswordFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setSubmitting(true);
    setResetMessageType(null);
    setResetMessage("Processing password reset...");

    try {
      const response = await fetch("/api/account/update-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      setResetMessage(data.message);

      if (response.status === 200) {
        setResetMessageType("success");
        resetForm();
        return;
      }

      setResetMessageType("error");
    } catch {
      setResetMessage("error");
      setResetMessage("Unexpected Error");
    } finally {
      setSubmitting(false);
    }
  };

  const validateResetPasswordForm = (values: ResetPasswordFormValues) => {
    try {
      ResetPasswordSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        return errors;
      }
      return {};
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="ml-4 text-slate-700 text-lg">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-red-600">
        Failed to load user profile.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{user.firstName}'s Profile - HealthApp</title>
      </Head>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your profile and view your history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-3">
                Your Information
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong className="text-slate-600">Name:</strong>{" "}
                  {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong className="text-slate-600">Username:</strong>{" "}
                  {user.userName}
                </p>
                <p>
                  <strong className="text-slate-600">Email:</strong>{" "}
                  {user.email}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-3">
                Reset Password
              </h2>
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }}
                validate={validateResetPasswordForm}
                onSubmit={handlePasswordResetSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Current Password
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className={`mt-1 block w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors duration-150 ease-in-out ${errors.currentPassword && touched.currentPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/60" : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"} focus:outline-none`}
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        New Password
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className={`mt-1 block w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors duration-150 ease-in-out ${errors.newPassword && touched.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/60" : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"} focus:outline-none`}
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmNewPassword"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <Field
                        type="password"
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        className={`mt-1 block w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors duration-150 ease-in-out ${errors.confirmNewPassword && touched.confirmNewPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/60" : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"} focus:outline-none`}
                      />
                      <ErrorMessage
                        name="confirmNewPassword"
                        component="div"
                        className="mt-1 text-xs text-red-600"
                      />
                    </div>

                    {resetMessage && (
                      <div
                        className={`p-2.5 rounded-md text-xs mt-3 ${
                          resetMessageType === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : resetMessageType === "error"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {resetMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-5 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition ease-in-out duration-150"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-3">
                Your Saved Prediction History
              </h2>
              {savedDiagnoses.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {savedDiagnoses.map((diagnosis, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow bg-slate-50/50"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-md font-semibold text-blue-700">
                          {diagnosis.modelUsed}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {new Date(diagnosis.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        <strong>Inputs:</strong> {diagnosis.inputSummary}
                      </p>
                      <p className="text-sm text-slate-800 font-medium">
                        <strong>Prediction:</strong> {diagnosis.prediction}
                      </p>
                      {diagnosis.accuracy && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Model Accuracy (at time of prediction):{" "}
                          {diagnosis.accuracy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-4 text-center">
                  You have no saved prediction history yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
