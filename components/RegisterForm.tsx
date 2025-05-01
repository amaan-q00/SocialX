"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { User, Lock,Mail } from "lucide-react"; // Importing icons from react-lucid-icons
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
      // Redirect or handle after success
    } catch (err:any) {
      setError(err.message);
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 bg-[#1a1a1a] text-text placeholder-muted p-2 rounded-md border border-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-brand text-bg p-2 rounded-md font-semibold hover:bg-accent transition"
      >
        Register
      </button>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </form>
  );
}
