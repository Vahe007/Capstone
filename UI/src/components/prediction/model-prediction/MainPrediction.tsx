"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import ClassificationReport from "./ClassificationReport";
import FileUploadForm from "./FileUploadForm";
import ManualInputForm from "./ManualInputForm";
import {
  ClassificationReportData,
  ModelPredicitonRequestInput,
  PredictionApiResponse,
} from "@/types";

declare const Chart: any;

export default function ModelPrediction() {
  const [selectedModel, setSelectedModel] = useState("xgboost");
  const [activeTab, setActiveTab] = useState<"manual" | "upload">("manual");
  const [fileName, setFileName] = useState("No file chosen");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<PredictionApiResponse | null>(null);
  const [predictionResponse, setPredictionResponse] =
    useState<PredictionApiResponse | null>(null);
  const [predictionText, setPredictionText] = useState<string | null>(null);

  const confusionMatrixChartRef = useRef<HTMLCanvasElement>(null);
  const metricsChartRef = useRef<HTMLCanvasElement>(null);
  const cmPlaceholderRef = useRef<HTMLParagraphElement>(null);
  const metricsPlaceholderRef = useRef<HTMLParagraphElement>(null);

  let confusionMatrixChartInstance: any = null;
  let metricsChartInstance: any = null;

  useEffect(() => {
    return () => {
      if (confusionMatrixChartInstance) confusionMatrixChartInstance.destroy();
      if (metricsChartInstance) metricsChartInstance.destroy();
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        console.log('file name is bro', e.target.files[0].name)
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const renderConfusionMatrixChart = (
    matrix: [[number, number], [number, number]],
  ) => {
    if (confusionMatrixChartInstance) confusionMatrixChartInstance.destroy();
    if (cmPlaceholderRef.current)
      cmPlaceholderRef.current.style.display = "none";

    if (confusionMatrixChartRef.current) {
      const ctx = confusionMatrixChartRef.current.getContext("2d");
      if (ctx) {
        confusionMatrixChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Predicted Negative", "Predicted Positive"],
            datasets: [
              {
                label: "Actual Negative",
                data: [matrix[0][0], matrix[0][1]],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Actual Positive",
                data: [matrix[1][0], matrix[1][1]],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "x",
            plugins: {
              title: { display: true, text: "Confusion Matrix" },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: { title: { display: true, text: "Predicted Label" } },
              y: { title: { display: true, text: "Count" }, beginAtZero: true },
            },
          },
        });
      }
    }
  };

  const renderMetricsChart = (report: ClassificationReportData) => {
    if (metricsChartInstance) metricsChartInstance.destroy();
    if (metricsPlaceholderRef.current)
      metricsPlaceholderRef.current.style.display = "none";

    const labels = Object.keys(report).filter((key) => !key.includes("avg"));
    const precisionData = labels.map((key) => report[key].precision);
    const recallData = labels.map((key) => report[key].recall);
    const f1Data = labels.map((key) => report[key]["f1-score"]);

    if (metricsChartRef.current) {
      const ctx = metricsChartRef.current.getContext("2d");
      if (ctx) {
        metricsChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels.map((l) => `Class ${l}`),
            datasets: [
              {
                label: "Precision",
                data: precisionData,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
              },
              {
                label: "Recall",
                data: recallData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "F1-Score",
                data: f1Data,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Class Metrics (Precision, Recall, F1-Score)",
              },
            },
            scales: { y: { beginAtZero: true, max: 1 } },
          },
        });
      }
    }
  };

  const handleRunPrediction = async ({
    features,
    model_type,
  }: ModelPredicitonRequestInput) => {

    console.log('onSubmit shold work bro')
    setIsLoading(true);
    setPredictionText(null);
    try {
      const body = {
        features,
        model_type,
      };

      console.log("body for the submission is ", body);
      const response = await fetch(`/api/predictions/model-prediction`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      console.log("response is response");

      const data = await response.json();

      console.log("data is data from the prediciton", data);

      setPredictionResponse(data);
      setPredictionText(
        `Prediction for ${data.model_name} is complete. The patient ${data.prediction === 1 ? "has" : "does not have"} heart disease.`,
      );
      setIsLoading(false);
    } catch (error) {
      console.log("error is error", error);
      setIsLoading(false);
    }
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    setSelectedModel(e.target.value);

    try {
        if (cmPlaceholderRef.current)
          cmPlaceholderRef.current.style.display = "block";
        if (metricsPlaceholderRef.current)
          metricsPlaceholderRef.current.style.display = "block";
        if (confusionMatrixChartInstance) confusionMatrixChartInstance.destroy();
        if (metricsChartInstance) metricsChartInstance.destroy();
    
        const model = e.target.value;
        const response = await fetch(`/api/predictions/metrics/${model}`, {
          method: "GET",
        });
    
        const data = await response.json();
    
        console.log("data on handleModel change is", data);
    
        if (response.status === 200) {
          setMetrics(data);
          renderConfusionMatrixChart(data.confusion_matrix);
          renderMetricsChart(data.classification_report);
          setIsLoading(false);
          return;
        }
    
        setIsLoading(false);
    } catch {
        console.log('error block')
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Prediction Analysis - HealthApp</title>
      </Head>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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
            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">
                1. Select Model & Input Method
              </h2>
              <div>
                <label
                  htmlFor="mlModel"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Choose Prediction Model:
                </label>
                <select
                  id="mlModel"
                  name="mlModel"
                  value={selectedModel}
                  onChange={handleModelChange}
                  className="form-select block w-full px-3 py-2.5 rounded-md border-slate-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                >
                  <option value="xgboost">XGBoost Model</option>
                  <option value="logistic_regression">
                    Logistic Regression
                  </option>
                  <option value="knn">KNN Model</option>
                </select>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Input Data Via:
                </label>
                <div className="flex border-b border-slate-300">
                  <button
                    onClick={() => setActiveTab("manual")}
                    className={`tab-button flex-1 py-2 px-4 text-sm font-medium text-slate-500 hover:text-blue-600 border-b-2 border-transparent focus:outline-none ${activeTab === "manual" ? "active" : ""}`}
                  >
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`tab-button flex-1 py-2 px-4 text-sm font-medium text-slate-500 hover:text-blue-600 border-b-2 border-transparent focus:outline-none ${activeTab === "upload" ? "active" : ""}`}
                  >
                    File Upload
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "manual" && (
              <ManualInputForm
                model_type={selectedModel}
                onSubmit={handleRunPrediction}
                isLoading={isLoading}
              />
            )}
            {activeTab === "upload" && (
              <FileUploadForm
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                onSubmit={handleRunPrediction}
                fileName={fileName}
                setFileName={setFileName}
                onFileChange={handleFileChange}
                model_type={selectedModel}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 min-h-[150px]">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">
                2. Prediction Summary
              </h2>
              {isLoading && (
                <p className="italic text-center py-8 text-slate-500">
                  Analyzing data and running prediction...
                </p>
              )}
              {!isLoading && !metrics && (
                <p className="italic text-center py-8 text-slate-500">
                  Results will appear here after running the prediction.
                </p>
              )}
              {!isLoading && predictionResponse && metrics && (
                <div>
                  <p className="text-lg text-slate-800">
                    <strong>Model:</strong> {predictionResponse.model_name}
                  </p>
                  <p className="text-lg text-slate-800">
                    <strong>Overall Accuracy:</strong>{" "}
                    <span className="font-bold text-blue-600">
                      {(metrics.accuracy * 100).toFixed(2)}%
                    </span>
                  </p>
                  {predictionText && (
                    <p className="mt-2 text-red-600 font-bold text-lg">
                      {predictionText}
                    </p>
                  )}
                </div>
              )}
            </div>

            {metrics && !isLoading && (
              <ClassificationReport
                classification_report={metrics.classification_report}
              />
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">
                3. Model Performance Visuals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 p-4 rounded-md min-h-[250px] flex items-center justify-center relative">
                  <canvas ref={confusionMatrixChartRef}></canvas>
                  <p
                    ref={cmPlaceholderRef}
                    className="absolute text-slate-400 italic"
                  >
                    Confusion Matrix will appear here.
                  </p>
                </div>
                <div className="border border-slate-200 p-4 rounded-md min-h-[250px] flex items-center justify-center relative">
                  <canvas ref={metricsChartRef}></canvas>
                  <p
                    ref={metricsPlaceholderRef}
                    className="absolute text-slate-400 italic"
                  >
                    Class Metrics Chart will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
