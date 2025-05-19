"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import { ForgotPasswordSchema } from "@/schemas/Auth.schema";

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);

  const handleResetSubmit = async (
    values: ForgotPasswordFormValues,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    setSubmitError(false);
    setSubmitMessage("Sending reset link...");
    try {
      const response = await fetch("/api/account/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      setSubmitting(false);
      setSubmitMessage(data.message);

      if (response.status !== 200) {
        setSubmitError(true);
      }

      setSubmitting(false);
    } catch {
      setSubmitError(true);
      setSubmitting(false);
      setSubmitMessage("Unexpected error occurred");
    }
  };

  const validateForm = (values: ForgotPasswordFormValues) => {
    try {
      ForgotPasswordSchema.parse(values);
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

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <img
            src="/logo.jpeg"
            alt="HealthApp Logo"
            width="50"
            className="rounded mb-3"
          />
          <h1 className="h3 mb-3 fw-normal">Reset Password</h1>
          <p className="text-muted">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          validate={validateForm}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate>
              <div className="form-floating mb-3">
                <Field
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                  id="email"
                />
                <label htmlFor="email">Email address</label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              {submitMessage && (
                <div
                  className={`alert ${submitError ? "alert-danger" : "alert-info"} small py-2 mt-3`}
                  role="alert"
                >
                  {submitMessage}
                </div>
              )}

              <button
                className="w-100 btn btn-lg btn-primary mt-4"
                type="submit"
                disabled={isSubmitting || (!submitError && !!submitMessage)}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-muted small">
          Remember your password? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
