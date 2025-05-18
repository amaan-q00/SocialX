import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import ToastProvider from "@/components/ToastProvider";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <body className="dark">
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}