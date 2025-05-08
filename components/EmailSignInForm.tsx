"use client";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useState, FormEvent } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

interface EmailSignInFormProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export default function EmailSignInForm({ loading, setLoading }: EmailSignInFormProps) {
  const router = useRouter();
  const { user,fetchOrCreateUserProfile } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await fetchOrCreateUserProfile(auth.currentUser);
        router.push("/dashboard");
      }
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === "auth/user-not-found") {
        toast.error("No user found, but you can create one");
        router.push("/register");
      } else {
        const message = error.message || "Login failed, try again!";
        toast.error(message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return user ? null : (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="relative">
        <Mail
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
          size={18}
        />
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
        <Lock
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
          size={18}
        />
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
        className="flex items-center justify-center gap-2 bg-brand text-text p-2 rounded-md font-semibold hover:bg-accent transition disabled:opacity-50"
      >
        <LogIn size={18} />
        {loading ? "Logging in..." : "Log In"}
      </button>

      <button
        type="button"
        onClick={handleRegisterRedirect}
        className="flex items-center justify-center gap-2 bg-accent text-text p-2 rounded-md font-semibold hover:bg-brand transition mt-4"
      >
        <UserPlus size={18} />
        Register
      </button>

      {/* {error && <p className="text-red-400 text-sm mt-1">{error}</p>} */}
    </form>
  );
}
