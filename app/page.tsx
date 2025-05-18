"use client";

import EmailSignInForm from "@/components/EmailSignInForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import SignInButton from "@/components/SignInButton";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return loading ? (
    <LoadingOverlay />
  ) : (
    <div className="fixed inset-0 overflow-y-auto bg-bg text-text flex items-center p-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-2xl space-y-5 mx-auto my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="SocialX" width={40} height={40} />
            <span className="text-2xl font-bold text-brand">SocialX</span>
          </div>
          <p className="text-xs text-muted text-center">
            Share media, chat with friends, and experience a new kind of social network.
          </p>
        </div>

        {/* Auth Box */}
        <div className="space-y-4">
          <SignInButton loading={loading} setLoading={setLoading} />

          <div className="flex items-center gap-2 text-muted text-xs">
            <div className="flex-grow h-px bg-muted" />
            OR
            <div className="flex-grow h-px bg-muted" />
          </div>

          <EmailSignInForm loading={loading} setLoading={setLoading} />

          <div className="flex justify-between text-xs text-muted">
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