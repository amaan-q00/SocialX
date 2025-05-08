'use client';
import { useState } from 'react';
import { MessageCircle, Users, User as UserIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export default function DashboardPage() {
  const { userData } = useAuthContext(); // Use userData instead of user

  const [activeTab, setActiveTab] = useState<'Chats' | 'Friends' | 'Profile'>('Chats');

  const TABS = [
    { label: 'Chats', icon: MessageCircle },
    { label: 'Friends', icon: Users },
    { label: 'Profile', icon: UserIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Chats':
        return <p>This is where your chats will appear.</p>;
      case 'Friends':
        return <p>Your friends will show up here.</p>;
      case 'Profile':
        return (
          <div>
            <p>This is your profile</p>
            {/* Use userData to display profile information */}
            <p>Email: {userData?.email}</p>
            <p>Username: {userData?.username}</p>
            <img
              src={userData?.profilePic || '/default-avatar.png'} // Default avatar if no profile picture
              alt="Profile Pic"
              className="w-24 h-24 rounded-full"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">{renderTabContent()}</div>

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
                  ? 'text-brand font-semibold'
                  : 'text-white/80 hover:text-white'
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
