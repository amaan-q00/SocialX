'use client';
import { useState } from 'react';
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoutes";
import  SignOutButton  from "@/components/SignOutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white dark:bg-gray-800 shadow p-4 fixed md:relative top-0 left-0 z-10 transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:block`}
        >
          <h1 className="text-2xl font-bold mb-8 text-black dark:text-white">socialX</h1>
          <SignOutButton />
        </aside>

        {/* Main content with topbar */}
        <main className="flex-1 ml-0 md:ml-64 p-4">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white bg-black p-2 rounded"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>

          <header className="w-full bg-white dark:bg-gray-800 shadow p-4 flex justify-end md:hidden">
            <SignOutButton />
          </header>

          <div className="p-6">
            <ProtectedRoute>{children}</ProtectedRoute>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
