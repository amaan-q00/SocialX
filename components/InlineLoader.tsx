"use client";
import React from "react";

export default function InlineLoader() {
  return (
    <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
