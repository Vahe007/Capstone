"use client";

import React from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (value: string) => void;
  activeTab: "manual" | "upload";
  onTabChange: (tab: "manual" | "upload") => void;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  activeTab,
  onTabChange,
}: ModelSelectorProps) {
  return (
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
          onChange={(e) => onModelChange(e.target.value)}
          className="form-select block w-full px-3 py-2.5 rounded-md border-slate-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
        >
          <option value="xgboost">XGBoost Model</option>
          <option value="logistic_regression">Logistic Regression</option>
          <option value="knn">KNN Model</option>
        </select>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Input Data Via:
        </label>
        <div className="flex border-b border-slate-300">
          {/* <Button onClick={() => onTabChange('manual')} variant="primary">Manual Entry</Button>
          <Button onClick={() => onTabChange('upload')} variant="primary">File Upload</Button> */}

          <button
            onClick={() => onTabChange("manual")}
            className={`flex-1 py-2 px-4 text-sm font-medium text-slate-500 hover:text-blue-600 border-b-2 border-transparent ${activeTab === "manual" ? "active" : ""}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => onTabChange("upload")}
            className={`flex-1 py-2 px-4 text-sm font-medium text-slate-500 hover:text-blue-600 border-b-2 border-transparent focus:outline-none ${activeTab === "upload" ? "active" : ""}`}
          >
            File Upload
          </button>
        </div>
      </div>
    </div>
  );
}
