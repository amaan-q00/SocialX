"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import {
  MessageCirclePlus,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useAuthContext();
  const username = userData?.username || "User";
  const profilePic = userData?.profilePic || "/default-avatar.png"; // fallback avatar
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return loading ? (
    <LoadingOverlay />
  ) : (
    
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
        {/* Logo or App name */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={30}
            height={30}
            className="rounded"
          />
          <span className="text-lg font-semibold text-brand">SocialX</span>
        </div>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="focus:outline-none focus:ring-2 focus:ring-brand rounded-full"
          >
            <Image
              src={profilePic}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border border-zinc-700"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded shadow-md z-50">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-zinc-800"
              >
                <UserIcon size={18} />
                Profile
              </button>
              <hr className="border-zinc-700 my-1" />
              <SignOutButton
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-zinc-800"
                loading={loading}
                setLoading={setLoading}
                label={`Logout (${username})`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg hover:bg-brand-dark transition-all"
        // onClick={() => console.log('FAB clicked')}
      >
        <MessageCirclePlus size={24} />
      </button>
    </div>
  );
}
