"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface SignInProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignInButton({ loading, setLoading }: SignInProps) {
  const {
    user,
    loading: userLoading,
  } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      router.push("/dashboard");
    } catch (err) {
      console.error("Auth error", err);
      toast.error("Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || user) return null;

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-brand text-text font-medium px-4 py-2 rounded-lg hover:bg-accent transition w-full"
    >
      <img
        src="/icons/google.svg"
        alt="Google"
        className="h-5 w-5"
      />
      <span>{loading ? "Logging in..." : "Sign in with Google"}</span>
    </button>
  );
}
