"use client";

import { ModelPredicitonRequestInput } from "@/types";

type ButtonProps = {
  onClick?: () => void;
  isLoading: boolean;
  type: string;
};

export function Button({ onClick, isLoading }: ButtonProps) {

  console.log('onCLick is', onClick);
  

  if (!onClick) {
    return (
      <button
        disabled={isLoading}
        className="w-full mt-[1.5rem!important] flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
      >
        {isLoading ? "Analyzing..." : "Run Prediction"}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full mt-[1.5rem!important] flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
    >
      {isLoading ? "Analyzing..." : "Run Prediction"}
    </button>
  );
}
