"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import {
  MoreVertical,
  MessageCirclePlus,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useAuthContext(); // Use userData instead of user
  const username = userData?.username || "User"; // Use username from userData
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return loading ? (
    <LoadingOverlay />
  ) : (
    <div className="flex flex-col h-screen bg-black text-white relative">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
        <h2 className="text-lg font-medium">Hi, {username} 👋</h2>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open menu"
            className="focus:outline-none focus:ring-2 focus:ring-brand rounded"
          >
            <MoreVertical />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded shadow-md z-50"
              role="menu"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-zinc-800"
                role="menuitem"
              >
                <UserIcon size={18} />
                Profile
              </button>
              <hr className="border-zinc-700 my-1" />
              <SignOutButton
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-zinc-800"
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>

      {/* FAB */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg hover:bg-brand-dark transition-all"
        // onClick={() => console.log('FAB clicked')}
      >
        <MessageCirclePlus size={24} />
      </button>
    </div>
  );
}
