"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailSignInForm() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) return <p className="text-gray-400">Loading...</p>;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        // If the user is not found, send them to register page
        router.push("/register");
      } else {
        if (err.message) {
          setError(err.message);
        } else {
          setError("Login failed, try again!");
        }
      }
    }
  };

  // Redirect to register page if the user is not logged in
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-brand text-text p-2 rounded-md font-semibold hover:bg-accent transition"
      >
        <LogIn size={18} />
        Log In
      </button>

      {/* Register button */}
      <button
        type="button"
        onClick={handleRegisterRedirect}
        className="flex items-center justify-center gap-2 bg-accent text-text p-2 rounded-md font-semibold hover:bg-brand transition mt-4"
      >
        <UserPlus size={18} />
        Register
      </button>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </form>
  );
}
