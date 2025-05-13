"use client";
import React from "react";

interface FileUploadFormProps {
  fileName: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadForm({
  fileName,
  onFileChange,
}: FileUploadFormProps) {
  return (
    <div className="tab-content active bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h3 className="text-lg font-medium text-slate-700 mb-4">
        Upload Medical Document:
      </h3>
      <form id="fileUploadForm" className="space-y-4">
        <p className="text-xs text-slate-500 mb-2">
          Supported formats: CSV, Excel, PDF (with structured data).
        </p>
        <div>
          <label
            htmlFor="medicalFile"
            className="file-input-label block w-full px-3 py-6 text-center border-2 border-dashed border-slate-300 rounded-md hover:border-blue-400 transition duration-150 ease-in-out"
          >
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-slate-600">
              Click to upload or drag and drop
            </span>
            <span
              id="fileNameDisplay"
              className="mt-1 block text-xs text-slate-500"
            >
              {fileName}
            </span>
          </label>
          <input
            type="file"
            name="medicalFile"
            id="medicalFile"
            className="sr-only"
            onChange={onFileChange}
          />
        </div>
      </form>
    </div>
  );
}
