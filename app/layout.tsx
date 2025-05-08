import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark">
        <AuthProvider>
        {children}
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
                primary: "#00b894", // or your accent/brand
                secondary: "#1a1a1a",
              },
            },
            error: {
              iconTheme: {
                primary: "#e74c3c", // red-ish
                secondary: "#1a1a1a",
              },
            },
          }}
        />
        </AuthProvider>
      </body>
    </html>
  );
}
