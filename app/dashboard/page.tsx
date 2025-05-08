"use client";
import { useState } from "react";
import { MessageCircle, Users, User as UserIcon } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { userData } = useAuthContext(); // Use userData instead of user

  const [activeTab, setActiveTab] = useState<"Chats" | "Friends" | "Profile">(
    "Chats"
  );

  const TABS = [
    { label: "Chats", icon: MessageCircle },
    { label: "Friends", icon: Users },
    { label: "Profile", icon: UserIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Chats":
        return <p>This is where your chats will appear.</p>;
      case "Friends":
        return <p>Your friends will show up here.</p>;
      case "Profile":
        return (
          <div className="flex flex-col items-center">
            <p>This is your profile</p>
            <p>Email: {userData?.email}</p>
            <p>Username: {userData?.username}</p>
            <div className="relative">
              <img
                src={userData?.profilePic || "/default-avatar.png"}
                alt="Profile Pic"
                className="w-24 h-24 rounded-full object-cover"
              />
              {!userData?.profilePic && (
                <button
                  onClick={() => alert("Upload Profile Picture")}
                  className="absolute bottom-0 right-0 bg-brand text-white p-1 rounded-full"
                >
                  <span className="text-sm">+</span>
                </button>
              )}
            </div>
            <button
              onClick={() => alert("Edit Profile")}
              className="mt-4 px-4 py-2 bg-accent text-text rounded-full hover:bg-accent-dark transition"
            >
              Edit Profile
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 bg-zinc-800 rounded-lg shadow-md transition-all duration-300">
        {renderTabContent()}
      </div>

      {/* Bottom Tabs */}
      <div className="flex justify-around items-center border-t border-zinc-800 bg-zinc-900 p-2 mt-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.label;
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label as any)}
              className={`flex flex-col items-center text-sm transition-all ${
                isActive
                  ? "text-brand font-semibold border-brand"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
