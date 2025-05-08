"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  className?: string;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SignOutButton({
  className = "",
  loading,
  setLoading,
}: SignOutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (setLoading) setLoading(true);
    await signOut(auth);
    if (setLoading) setLoading(false);
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-left w-full px-4 py-2 ${className}`}
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
