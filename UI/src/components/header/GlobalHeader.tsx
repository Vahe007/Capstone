"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useUserSession } from "@/providers/userSessionProvider/UserSessionProvider";
import NavLink from "./NavLink";
import { useRouter } from "next/navigation";

export default function GlobalHeader() {
  const { user, logout } = useUserSession();
  const router = useRouter();
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    if (logout) {
      logout();
      router.push("/login");
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/">HealthApp</Link>
            </div>

            <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
              <NavLink href="/initial-diagnosis">Initial Diagnosis</NavLink>
              <NavLink href="/prediction-analysis">Prediction Analysis</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <button
                onClick={handleLogout}
                className="text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </nav>

            <div className="md:hidden">
              <button
                type="button"
                onClick={() => alert("Mobile menu to be implemented")}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
