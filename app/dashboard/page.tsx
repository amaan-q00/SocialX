"use client";
import { useState } from "react";
import { MessageCircle, Users, User as UserIcon } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import Profile from "@/components/Profile";
import FriendsTab from "@/components/Friends";
import RecentChats from "@/components/RecentChat";

export default function DashboardPage() {
  const { userData } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"Chats" | "Friends" | "Profile">("Chats");

  const TABS = [
    { label: "Chats", icon: MessageCircle },
    { label: "Friends", icon: Users },
    { label: "Profile", icon: UserIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Chats": return <RecentChats />;
      case "Friends": return <FriendsTab />;
      case "Profile": return <Profile />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-0">{renderTabContent()}</div>

      {/* Bottom Tabs */}
      <div className="sticky bottom-0 flex justify-around items-center border-t border-zinc-800 bg-zinc-900 p-2 safe-area-padding">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.label;
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label as any)}
              className={`flex flex-col items-center text-sm transition-all ${
                isActive ? "text-brand font-semibold" : "text-white/80 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}