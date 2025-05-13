"use client";

import React, { useState, useEffect, useRef } from "react";
import ModelSelector from "@/components/prediction/ModelSelector";
import ManualInputForm from "@/components/prediction/ManualInputForm";
import FileUploadForm from "@/components/prediction/FileUploadForm";
import PredictionResults from "@/components/prediction/PredictionResults";
import PerformanceVisuals from "@/components/prediction/PerformanceVisuals";

declare var Chart: any;

export default function PredictionAnalysisPage() {
  const [selectedModel, setSelectedModel] = useState("xgboost");
  const [activeTab, setActiveTab] = useState<"manual" | "upload">("manual");
  const [fileName, setFileName] = useState("No file chosen");
  const [predictionResultHTML, setPredictionResultHTML] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const confusionMatrixChartRef = useRef<HTMLCanvasElement>(null);
  const rocCurveChartRef = useRef<HTMLCanvasElement>(null);
  const cmPlaceholderRef = useRef<HTMLParagraphElement>(null);
  const rocPlaceholderRef = useRef<HTMLParagraphElement>(null);

  const chartInstances = useRef<{ cm: any; roc: any }>({ cm: null, roc: null });

  useEffect(() => {
    return () => {
      if (chartInstances.current.cm) chartInstances.current.cm.destroy();
      if (chartInstances.current.roc) chartInstances.current.roc.destroy();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const renderCharts = () => {
    if (chartInstances.current.cm) chartInstances.current.cm.destroy();
    if (chartInstances.current.roc) chartInstances.current.roc.destroy();

    if (cmPlaceholderRef.current)
      cmPlaceholderRef.current.style.display = "none";
    if (rocPlaceholderRef.current)
      rocPlaceholderRef.current.style.display = "none";

    if (confusionMatrixChartRef.current) {
      const cmCtx = confusionMatrixChartRef.current.getContext("2d");
      if (cmCtx && typeof Chart !== "undefined") {
        chartInstances.current.cm = new Chart(cmCtx, {
          type: "bar",
          data: {
            labels: ["Predicted No", "Predicted Yes"],
            datasets: [
              {
                label: "Actual No",
                data: [
                  Math.floor(Math.random() * 100),
                  Math.floor(Math.random() * 20),
                ],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
              {
                label: "Actual Yes",
                data: [
                  Math.floor(Math.random() * 20),
                  Math.floor(Math.random() * 100),
                ],
                backgroundColor: [
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: "Confusion Matrix (Example)" },
            },
            scales: { x: { stacked: true }, y: { stacked: true } },
          },
        });
      }
    }

    if (rocCurveChartRef.current) {
      const rocCtx = rocCurveChartRef.current.getContext("2d");
      if (rocCtx && typeof Chart !== "undefined") {
        chartInstances.current.roc = new Chart(rocCtx, {
          type: "line",
          data: {
            labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            datasets: [
              {
                label:
                  "ROC Curve (AUC = " +
                  (Math.random() * (0.95 - 0.7) + 0.7).toFixed(2) +
                  ")",
                data: [
                  0, 0.05, 0.15, 0.3, 0.5, 0.7, 0.8, 0.88, 0.92, 0.95, 1.0,
                ].sort(() => 0.5 - Math.random()),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
              {
                label: "Random Classifier",
                data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                borderColor: "rgb(201, 203, 207)",
                borderDash: [5, 5],
                tension: 0.1,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: "ROC Curve (Example)" } },
            scales: {
              x: {
                title: { display: true, text: "False Positive Rate" },
                min: 0,
                max: 1,
              },
              y: {
                title: { display: true, text: "True Positive Rate" },
                min: 0,
                max: 1,
              },
            },
          },
        });
      }
    }
  };

  const handleRunPrediction = async () => {
    setIsLoading(true);
    setPredictionResultHTML(null);
    if (cmPlaceholderRef.current)
      cmPlaceholderRef.current.style.display = "block";
    if (rocPlaceholderRef.current)
      rocPlaceholderRef.current.style.display = "block";
    if (chartInstances.current.cm) chartInstances.current.cm.destroy();
    if (chartInstances.current.roc) chartInstances.current.roc.destroy();

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const modelText =
      selectedModel === "xgboost"
        ? "XGBoost Model"
        : selectedModel === "logistic_regression"
          ? "Logistic Regression"
          : "KNN Model";
    const riskLevels = ["Low Risk", "Moderate Risk", "High Risk"];
    const randomRisk =
      riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const randomProbability = (Math.random() * (0.95 - 0.3) + 0.3).toFixed(2);
    const riskColor =
      randomRisk === "High Risk"
        ? "text-red-600"
        : randomRisk === "Moderate Risk"
          ? "text-amber-600"
          : "text-green-600";

    setPredictionResultHTML(`
            <div class="text-center">
                <p class="text-lg text-slate-700">Based on the provided data and the <strong>${modelText}</strong> model:</p>
                <p class="text-4xl font-bold ${riskColor} mt-3 mb-2">${randomRisk}</p>
                <p class="text-lg text-slate-600">(${(parseFloat(randomProbability) * 100).toFixed(0)}% Probability)</p>
                <p class="text-sm text-slate-500 mt-1">Confidence Score: ${(Math.random() * (0.98 - 0.75) + 0.75).toFixed(2)}</p>
                <hr class="my-6 border-slate-300">
                <h4 class="font-semibold text-md text-slate-700 mb-2">Key Contributing Factors (Example):</h4>
                <ul class="list-disc list-inside text-sm text-left mx-auto max-w-sm text-slate-600">
                    <li>Age</li>
                    <li>Cholesterol Level</li>
                    <li>Blood Pressure</li>
                </ul>
            </div>
        `);
    renderCharts();
    setIsLoading(false);
  };

  return (
    <>
      <header className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-blue-600">
            HealthApp
          </a>
          <nav className="space-x-4">
            <a href="#" className="text-slate-600 hover:text-blue-600">
              Dashboard
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600">
              Symptom Checker
            </a>
            <a href="#" className="text-blue-600 font-semibold">
              Prediction Analysis
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-600">
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Health Prediction Analysis
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Utilize our machine learning models to analyze health data and
            predict outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {activeTab === "manual" && <ManualInputForm />}
            {activeTab === "upload" && (
              <FileUploadForm
                fileName={fileName}
                onFileChange={handleFileChange}
              />
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <button
                type="button"
                onClick={handleRunPrediction}
                disabled={isLoading}
                className="btn-primary w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
              >
                {isLoading ? (
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
                    Analyzing...
                  </>
                ) : (
                  "Run Prediction"
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PredictionResults
              isLoading={isLoading}
              resultHTML={predictionResultHTML}
            />
            <PerformanceVisuals
              confusionMatrixChartRef={confusionMatrixChartRef}
              rocCurveChartRef={rocCurveChartRef}
              cmPlaceholderRef={cmPlaceholderRef}
              rocPlaceholderRef={rocPlaceholderRef}
            />
          </div>
        </div>
      </main>
    </>
  );
}
