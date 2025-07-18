"use client";
import toast from "react-hot-toast";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { useState, FormEvent } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

interface EmailSignInFormProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EmailSignInForm({ loading, setLoading }: EmailSignInFormProps) {
  const router = useRouter();
  const { user, fetchOrCreateUserProfile } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser && auth.currentUser.emailVerified) {
        await fetchOrCreateUserProfile(auth.currentUser);
        router.push("/dashboard");
      } else {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
          await sendEmailVerification(auth.currentUser);
          await auth.signOut();
          toast.success(
            "Verification email sent. Please verify before logging in."
          );
        }
      }
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === "auth/user-not-found") {
        toast.error("No user found. Try registering.");
        router.push("/register");
      } else {
        toast.error(error.message || "Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
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
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
        <input
          required
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-brand"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-brand text-text p-2 rounded-md font-semibold hover:bg-accent transition disabled:opacity-50"
      >
        <LogIn size={18} />
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
