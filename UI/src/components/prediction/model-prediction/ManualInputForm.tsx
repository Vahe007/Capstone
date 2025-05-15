"use client";
import React from "react";

export default function ManualInputForm() {
  return (
    <div className="tab-content active bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h3 className="text-lg font-medium text-slate-700 mb-4">
        Enter Features Manually:
      </h3>
      <form id="manualFeaturesForm" className="space-y-4">
        <div>
          <label
            htmlFor="feature1"
            className="block text-sm font-medium text-slate-600"
          >
            Age (years)
          </label>
          <input
            type="number"
            name="feature1"
            id="feature1"
            className="form-input mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            placeholder="e.g., 45"
          />
        </div>
        <div>
          <label
            htmlFor="feature2"
            className="block text-sm font-medium text-slate-600"
          >
            Cholesterol (mg/dL)
          </label>
          <input
            type="number"
            name="feature2"
            id="feature2"
            className="form-input mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            placeholder="e.g., 210"
          />
        </div>
        <div>
          <label
            htmlFor="feature3"
            className="block text-sm font-medium text-slate-600"
          >
            Blood Pressure (systolic)
          </label>
          <input
            type="number"
            name="feature3"
            id="feature3"
            className="form-input mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            placeholder="e.g., 120"
          />
        </div>
        <div>
          <label
            htmlFor="feature4"
            className="block text-sm font-medium text-slate-600"
          >
            Max Heart Rate
          </label>
          <input
            type="number"
            name="feature4"
            id="feature4"
            className="form-input mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
            placeholder="e.g., 150"
          />
        </div>
      </form>
    </div>
  );
}
