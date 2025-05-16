"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
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
  const profilePic = userData?.profilePic || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="focus:outline-none focus:ring-2 focus:ring-brand rounded-full"
          >
            {profilePic === "" ? (
              <UserIcon
                size={36}
                className="rounded-full border border-zinc-700"
              />
            ) : (
              <Image
                src={profilePic}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full border border-zinc-700"
              />
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded shadow-md z-50">
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
    </div>
  );
}
