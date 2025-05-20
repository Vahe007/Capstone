"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import { password, ResetPasswordSchema } from "@/schemas/Auth.schema";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();

  const onSubmit = async (
    values: ResetPasswordFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setSubmitMessage("");
    setSubmitError(false);
    setSubmitMessage("Setting new password...");

    const token = searchParams.get("token");
    if (!token) {
      setSubmitMessage("Password reset token is missing. Cannot proceed.");
      setSubmitError(true);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/account/recover-password", {
        method: "POST",
        body: JSON.stringify({
          password: values.password,
          token,
        }),
      });

      const data = await response.json();
      setSubmitMessage(data.message);
      setSubmitting(false);

      if (response.status === 200) {
        setSubmitError(false);
        return router.push("/login");
      }

      setSubmitError(true);
    } catch {
      setSubmitError(true);
      setSubmitMessage("Unexpected Error");
      setSubmitting(false);
    }
  };

  const validateFormWithZod = (values: ResetPasswordFormValues) => {
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

  return (
    <div
      className="card shadow-sm border-0 max-w-md mx-auto"
      style={{ maxWidth: "900px" }}
    >
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-shield-lock-fill text-primary mb-3"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 0c-.084 0-.168.003-.25.007l-.004.001l-.004.001l-.003.001l-.003.001l-.002.001l-.002.001l-.002.001L7.726.012L7.72.013l-.002.001L7.712.016L7.7.017A5 5 0 0 0 5.196 1.01H5.19a5 5 0 0 0-1.012.194L4.17 1.21A5 5 0 0 0 1.01 5.196L1.01 5.19A5 5 0 0 0 .815 6.206L.807 6.21A5 5 0 0 0 .012 7.726L.012 7.73L.01 7.734a5 5 0 0 0-.003.006a5 5 0 0 0-.002.005L0 7.996L0 8c0 .084.003.168.007.25l.001.004l.001.004l.001.003l.001.003l.001.002l.001.002l.001.002l.001.001L.012 8.27l.001.002L.016 8.28l.001.007A5 5 0 0 0 .206 10.8L.21 10.83a5 5 0 0 0 .194 1.012L.412 11.85A5 5 0 0 0 5.196 14.99L5.19 14.99a5 5 0 0 0 1.012.194l.008.007A5 5 0 0 0 7.726 15.988L7.73 15.988l.002.001L7.734 15.99l.006.003a5 5 0 0 0 .005.002L7.996 16L8 16c.084 0 .168-.003.25-.007l.004-.001l.004-.001l.003-.001l.003-.001l.002-.001l.002-.001l.002-.001L8.274 15.988l.006-.001l.002-.001l.007-.001A5 5 0 0 0 10.804 14.99h.001a5 5 0 0 0 1.012-.194l.008-.007A5 5 0 0 0 14.988 10.274l.001-.006l.001-.002l.001-.007A5 5 0 0 0 15.185 8.81L15.193 8.8A5 5 0 0 0 15.988 7.274l-.001-.006l-.001-.002L15.983 7.26A5 5 0 0 0 14.99 5.196L14.99 5.19a5 5 0 0 0-.194-1.012l-.007-.008A5 5 0 0 0 10.274.012L10.27 .012l-.002-.001L10.266 0H8zm.5 5.002a.5.5 0 0 1 .5.5v1.004H10V6.5a.5.5 0 0 1 1 0v1.004h.5a.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3.5a.5.5 0 0 1 .5-.5H8V6.5a.5.5 0 0 1 .5-.5"
            />
            <path d="M8 5.996c1.38 0 2.5 1.12 2.5 2.5V11h-5V8.496c0-1.38 1.12-2.5 2.5-2.5z" />
          </svg>
          <h1 className="h3 mb-3 fw-normal">Make your password reset</h1>
          <p className="text-muted">Please enter your new password below.</p>
        </div>

        <Formik
          initialValues={{ password: "" }}
          validate={validateFormWithZod}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate>
              <div className="form-floating mb-3">
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password"
                  className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                  id="password"
                />
                <label htmlFor="password">New Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              {submitMessage && (
                <div
                  className={`alert ${submitError ? "alert-danger" : "alert-success"} small py-2 mt-3`}
                  role="alert"
                >
                  {submitMessage}
                </div>
              )}

              <button
                className="w-100 btn btn-lg btn-primary mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Setting Password...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </Form>
          )}
        </Formik>

        {submitMessage && !submitError && (
          <p className="mt-4 text-center text-muted small">
            <Link href="/login">Proceed to Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
