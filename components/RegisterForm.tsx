"use client";
import React, { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/config";
import { User, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import toast from "react-hot-toast";

interface RegisterFormProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export default function RegisterForm({
  loading,
  setLoading,
}: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        // Send email verification to user
        await sendEmailVerification(user);
  
        toast.success("Email with verification link sent to your email. Please verify your email before logging in.");
        await auth.signOut(); 
      }
  
      router.push("/"); // Redirect after sending email verification
    } catch (err) {
      const error = err as FirebaseError;
      toast.error(error.message || "Registration failed");
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-brand mb-6">
        <User className="h-6 w-6 text-brand" />
        Create Your Account
      </h2>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-brand text-bg p-2 rounded-md font-semibold hover:bg-accent transition disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="text-sm text-muted text-center">
        <a href="/" className="text-brand hover:underline">
          Back to Sign In
        </a>
      </p>
      {/* {error && <p className="text-red-400 text-sm mt-1">{error}</p>} */}
    </form>
  );
}
