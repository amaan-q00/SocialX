"use client";

import EmailSignInForm from "@/components/EmailSignInForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import SignInButton from "@/components/SignInButton";
import Image from "next/image";
import logo from "@/public/logo.png"; // or wherever your actual logo is
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return loading ? (
    <LoadingOverlay />
  ) : (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="SocialX" width={50} height={50} />
            <span className="text-3xl font-bold text-brand pb-1">SocialX</span>
          </div>
          <p className="text-sm text-muted text-center">
            Share media, chat with friends, and experience a new kind of social network.
          </p>
        </div>

        {/* Auth Box */}
        <div className="space-y-5">
          <SignInButton loading={loading} setLoading={setLoading} />

          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="flex-grow h-px bg-muted" />
            OR
            <div className="flex-grow h-px bg-muted" />
          </div>

          <EmailSignInForm loading={loading} setLoading={setLoading} />

          <div className="flex justify-between text-sm text-muted">
            <a href="/forgot-password" className="text-brand hover:underline">
              Forgot password?
            </a>
            <a href="/register" className="text-brand hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
