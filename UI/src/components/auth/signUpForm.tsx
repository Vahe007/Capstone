"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import { SignupSchema } from "@/schemas/Auth.schema";
import Cookies from "js-cookie";
import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";

type SignupFormValues = z.infer<typeof SignupSchema>;

const SignupForm: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUserSession();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);

  const handleSignupSubmit = async (
    values: SignupFormValues,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    setSubmitting(true);
    setSubmitError(false);
    setSubmitMessage("Creating account...");

    try {
      const { confirmPassword, terms, ...payload } = values;

      const response = await fetch("/api/account/register", {
        method: "POST",
        body: JSON.stringify(payload),
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

        setUser(data.user_info);

        if (data?.userInfo?.isVerified) {
          router.push("/prediction-analysis");
        } else {
          router.push("/unverified");
        }
      }

      setSubmitting(false);
      setSubmitMessage("");
    } catch {
      setSubmitError(true);
      setSubmitMessage("Error");
      setSubmitting(false);
    }
  };

  const validateForm = (values: SignupFormValues) => {
    try {
      SignupSchema.parse(values);
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
          <h1 className="h3 mb-3 fw-normal">Create Account</h1>
          <p className="text-muted">Join HealthApp today!</p>
        </div>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validate={validateForm}
          onSubmit={handleSignupSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate>
              <div className="row g-3">
                <div className="col-md-6 form-floating mb-3">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="John"
                    className={`form-control ${errors.firstName && touched.firstName ? "is-invalid" : ""}`}
                    id="firstName"
                  />
                  <label htmlFor="firstName" className="ms-2">
                    First Name
                  </label>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="col-md-6 form-floating mb-3">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    className={`form-control ${errors.lastName && touched.lastName ? "is-invalid" : ""}`}
                    id="lastName"
                  />
                  <label htmlFor="lastName" className="ms-2">
                    Last Name
                  </label>
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>

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

              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="userName"
                  placeholder="name_surname"
                  className={`form-control ${errors.userName && touched.userName ? "is-invalid" : ""}`}
                  id="userName"
                />
                <label htmlFor="email">Username</label>
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

              <div className="form-floating mb-3">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? "is-invalid" : ""}`}
                  id="confirmPassword"
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-check mb-3">
                <Field
                  type="checkbox"
                  name="terms"
                  className={`form-check-input ${errors.terms && touched.terms ? "is-invalid" : ""}`}
                  id="terms"
                />
                <label
                  className="form-check-label text-muted small"
                  htmlFor="terms"
                >
                  I agree to the{" "}
                  <a href="/terms" className="text-decoration-none">
                    Terms and Conditions
                  </a>
                </label>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className="invalid-feedback d-block"
                />
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
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-muted small">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
