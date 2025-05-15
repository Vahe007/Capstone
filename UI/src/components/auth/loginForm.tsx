"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import { LoginSchema, userName } from "@/schemas/Auth.schema";
import Cookies from "js-cookie";
import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUserSession();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);

  const handleLoginSubmit = async (
    values: LoginFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setSubmitError(false);
    setSubmitMessage("Logging in...");
    setSubmitting(true);

    try {
      const { userName, password } = values;
      const response = await fetch("/api/account/login", {
        method: "POST",
        body: JSON.stringify({
          userName,
          password,
        }),
      });

      const data = await response.json();

      if (data?.error) {
        setSubmitError(true);
        setSubmitMessage(data.error);
        setSubmitting(false);
        return;
      }

      if (data?.access_token) {
        Cookies.set("accessToken", data.access_token, {
          expires: 0.0208,
        });

        setUser(data.userInfo);

        if (data?.userInfo?.isVerified) {
          router.push("/prediction-analysis");
        } else {
          router.push("/unverified");
        }
        return;
      }

      setSubmitError(true);
      setSubmitMessage("Invalid credentials");
    } catch {
      setSubmitError(true);
      setSubmitMessage("Error");
      setSubmitting(false);
    }
  };

  const validateForm = (values: LoginFormValues) => {
    try {
      LoginSchema.parse(values);
      console.log("values", values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });

        console.log("errors are ", errors);
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
          <h1 className="h3 mb-3 fw-normal">Sign In</h1>
          <p className="text-muted">Welcome back! Please enter your details.</p>
        </div>

        <Formik
          initialValues={{ userName: "", password: "", rememberMe: false }}
          validate={validateForm}
          onSubmit={handleLoginSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate>
              <div className="form-floating mb-3">
                <Field
                  type="userName"
                  name="userName"
                  placeholder="name@example.com"
                  className={`form-control ${errors.userName && touched.userName ? "is-invalid" : ""}`}
                  id="userName"
                />
                <label htmlFor="userName">Username</label>
                <ErrorMessage
                  name="userName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-floating mb-3">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                  id="password"
                />
                <label htmlFor="password">Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label
                    className="form-check-label text-muted small"
                    htmlFor="rememberMe"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="/reset-password">Forgot password?</Link>
              </div>

              {submitMessage && (
                <div
                  className={`alert ${submitError ? "alert-danger" : "alert-info"} small py-2`}
                  role="alert"
                >
                  {submitMessage}
                </div>
              )}

              <button
                className="w-100 btn btn-lg btn-primary"
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-muted small">
          Don&apos;t have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
