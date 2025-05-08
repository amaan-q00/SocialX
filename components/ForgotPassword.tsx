"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { MailCheck } from "lucide-react";
import { FirebaseError } from "firebase/app";
import LoadingOverlay from "./LoadingOverlay";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.includes("@") || email.length < 5) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      const err = error as FirebaseError;
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="flex flex-col gap-3 w-full max-w-sm"
    >
      {loading && <LoadingOverlay />}
      <div className="relative">
        <MailCheck
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          size={18}
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <button
        type="submit"
        className="bg-brand text-text py-2 rounded-md font-semibold hover:bg-accent transition"
      >
        Send Reset Link
      </button>
      <p className="text-sm text-muted text-center">
        <a href="/" className="text-brand hover:underline">
          Back to Sign In
        </a>
      </p>
    </form>
  );
}
