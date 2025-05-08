"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import RegisterForm from "@/components/RegisterForm";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  return loading ? (
    <LoadingOverlay />
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-brand tracking-tight">
          Create an Account
        </h1>
        <RegisterForm loading={loading} setLoading={setLoading} />
      </div>
    </div>
  );
}
