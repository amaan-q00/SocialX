"use client";

import { useEffect } from "react";

export default function LoadingOverlay() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
