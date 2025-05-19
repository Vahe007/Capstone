"use client";
import { ClassificationReportData } from "@/types";
import React from "react";

export default function ClassificationReport({
  classification_report,
}: {
  classification_report: ClassificationReportData;
}) {
  if (!classification_report) {
    return null;
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">
        Classification Report
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-4 py-2">
                Class/Avg
              </th>
              <th scope="col" className="px-4 py-2">
                Precision
              </th>
              <th scope="col" className="px-4 py-2">
                Recall
              </th>
              <th scope="col" className="px-4 py-2">
                F1-Score
              </th>
              <th scope="col" className="px-4 py-2">
                Support
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(classification_report).map(([key, value]) => (
              <tr key={key} className="bg-white border-b hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                  {key.includes("avg") ? key.toUpperCase() : `Class ${key}`}
                </td>
                <td className="px-4 py-2">{value.precision.toFixed(2)}</td>
                <td className="px-4 py-2">{value.recall.toFixed(2)}</td>
                <td className="px-4 py-2">{value["f1-score"].toFixed(2)}</td>
                <td className="px-4 py-2">{value.support}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
