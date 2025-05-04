"use client"
import EmailSignInForm from "@/components/EmailSignInForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import SignInButton from "@/components/SignInButton";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text px-6 py-12">
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-5xl font-extrabold text-brand tracking-tight">
            Welcome to SocialX
          </h1>
          <p className="mt-3 text-lg text-muted">
            Share media, chat with friends, and experience a new kind of social
            network.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-xl flex flex-col gap-6">
          <SignInButton loading={loading} setLoading={setLoading} />

          <div className="flex items-center gap-2 text-muted text-sm">
            <div className="flex-grow h-px bg-muted" />
            OR
            <div className="flex-grow h-px bg-muted" />
          </div>

          <EmailSignInForm loading={loading} setLoading={setLoading}/>
          <p className="text-sm text-muted text-center">
            <a href="/forgot-password" className="text-brand hover:underline">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
