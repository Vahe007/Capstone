import AuthImage from "@/components/auth/authImage";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-md-6 d-none d-md-flex h-100">
          <AuthImage imageUrl="https://img.freepik.com/free-vector/blue-hexagonal-medical-healthcare-background-design_1017-26836.jpg" />
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-light h-100 p-4 p-sm-5">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
