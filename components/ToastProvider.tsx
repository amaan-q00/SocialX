"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid var(--color-brand)",
        },
        success: {
          iconTheme: {
            primary: "#00b894",
            secondary: "#1a1a1a",
          },
        },
        error: {
          iconTheme: {
            primary: "#e74c3c",
            secondary: "#1a1a1a",
          },
        },
      }}
    />
  );
}
