"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";

export default function SignOutButton() {
  const { user, loading } = useAuthContext();
  if (loading) return <p className="text-gray-400">Loading...</p>;
  return user ? (
    <button
      onClick={() => signOut(auth)}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  ) : null;
}
