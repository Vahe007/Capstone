"use client";
import React from "react";

interface PerformanceVisualsProps {
  confusionMatrixChartRef: React.RefObject<HTMLCanvasElement>;
  rocCurveChartRef: React.RefObject<HTMLCanvasElement>;
  cmPlaceholderRef: React.RefObject<HTMLParagraphElement>;
  rocPlaceholderRef: React.RefObject<HTMLParagraphElement>;
}

export default function PerformanceVisuals({
  confusionMatrixChartRef,
  rocCurveChartRef,
  cmPlaceholderRef,
  rocPlaceholderRef,
}: PerformanceVisualsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        3. Model Performance Visuals
      </h2>
      <div id="graphsArea" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 p-4 rounded-md min-h-[250px] flex items-center justify-center relative">
          <canvas ref={confusionMatrixChartRef}></canvas>
          <p ref={cmPlaceholderRef} className="absolute text-slate-400 italic">
            Confusion Matrix will appear here.
          </p>
        </div>
        <div className="border border-slate-200 p-4 rounded-md min-h-[250px] flex items-center justify-center relative">
          <canvas ref={rocCurveChartRef}></canvas>
          <p ref={rocPlaceholderRef} className="absolute text-slate-400 italic">
            ROC Curve / Feature Importance will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
