import React, { Suspense } from "react";
import VerifyEmail from "@/components/verifyEmail/verifyEmail";

export default function SignupPage() {
  return (
    <>
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen text-slate-500">
              Loading verification status...
            </div>
          }
        >
          <VerifyEmail />
        </Suspense>
      </main>
    </>
  );
}
