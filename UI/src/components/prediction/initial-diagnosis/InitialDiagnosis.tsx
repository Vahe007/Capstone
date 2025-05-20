"use client";

import React, { useState } from "react";
import Head from "next/head";

interface SimilarCase {
  id: string;
  description: string;
  outcome?: string;
}

export default function InitialDiagnosis() {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [similarCases, setSimilarCases] = useState<string[]>([]);
  const [showResultArea, setShowResultArea] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSymptoms = symptoms.trim();

    if (!trimmedSymptoms) {
      setDiagnosisResult(
        '<p class="text-red-600 font-medium">Please describe your symptoms before submitting.</p>',
      );
      setSimilarCases([]);
      setShowResultArea(true);
      return;
    }

    setIsLoading(true);
    setShowResultArea(true);
    setDiagnosisResult(
      '<p class="italic text-slate-500">Analyzing your symptoms, please wait...</p>',
    );
    setSimilarCases([]);

    try {
      const response = await fetch("/api/predictions/initial-diagnosis", {
        method: "POST",
        body: JSON.stringify({ freestyle_text: trimmedSymptoms }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setSimilarCases(data.similar_cases || []);
        setDiagnosisResult(`
              <p>${data.diagnosis}</p>
              <p class="mt-4 text-sm font-semibold text-red-600">
                <strong>Disclaimer:</strong> This is an automated insight and NOT a medical diagnosis. 
                Please consult a healthcare professional for accurate medical advice and treatment.
              </p>
            `);
      } else {
        setDiagnosisResult(
          `<p class="text-red-600 font-medium">${data.error || "An error occurred during diagnosis."}</p>`,
        );
      }
    } catch (error) {
      console.error("Diagnosis error:", error);
      setDiagnosisResult(
        '<p class="text-red-600 font-medium">An unexpected error occurred. Please try again later.</p>',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Initial Symptom Checker - HealthApp</title>
      </Head>

      <div className="max-w-2xl mx-auto flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Initial Symptom Checker
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Describe your main symptoms below. Our system will provide some
            general insights.
          </p>
          <p className="text-red-600 mt-2 text-xs sm:text-sm font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 inline-block mr-1 align-text-bottom"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 11.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0v-.008a.75.75 0 0 1 .75-.75Zm.01-4.72a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            This is not a substitute for professional medical advice. Always
            consult a doctor.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="symptoms"
                className="block text-lg font-medium text-slate-700 mb-2"
              >
                Describe your symptoms:
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={6}
                className="form-textarea block w-full px-3 py-2 rounded-md border-slate-300 shadow-sm placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="E.g. I'm a 60-year-old female with high blood pressure and occasional chest discomfort..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-6 text-right">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition ease-in-out duration-150"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Analyzing...
                  </>
                ) : (
                  "Get Initial Insights"
                )}
              </button>
            </div>
          </form>
        </div>

        {showResultArea && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Initial Insights:
            </h2>
            <div
              className="text-slate-700 space-y-3 text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: diagnosisResult || "" }}
            />
          </div>
        )}

        {showResultArea && !isLoading && similarCases.length > 0 && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Similar Cases from Other Patients:
            </h2>
            <div className="space-y-4">
              {similarCases.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">
              Note: These are experiences shared by others and are not medical
              advice.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
