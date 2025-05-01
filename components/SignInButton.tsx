"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";

export default function SignInButton() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  if (loading) return <p className="text-gray-400">Loading...</p>;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      //  redirect to dashboard after successful sign-in
      router.push("/dashboard");
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  return user ? null : (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-brand text-text font-medium px-4 py-2 rounded-lg hover:bg-accent transition"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="h-5 w-5"
      />
      <span>Sign in with Google</span>
    </button>
  );
}
