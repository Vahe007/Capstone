"use client";
import React from "react";

interface PredictionResultsProps {
  isLoading: boolean;
  resultHTML: string | null;
}

export default function PredictionResults({
  isLoading,
  resultHTML,
}: PredictionResultsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 min-h-[200px]">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        2. Prediction Results
      </h2>
      {isLoading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            Analyzing data and running prediction...
          </p>
        </div>
      )}
      {resultHTML && !isLoading && (
        <div
          className="text-slate-600"
          dangerouslySetInnerHTML={{ __html: resultHTML }}
        />
      )}
      {!resultHTML && !isLoading && (
        <p className="italic text-center py-8 text-slate-500">
          Results will appear here after running the prediction.
        </p>
      )}
    </div>
  );
}
