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
          <AuthImage imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjNvL1bpCc1TLzeHMESmYakMcPaS3yI8Yh6g&s" />
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
