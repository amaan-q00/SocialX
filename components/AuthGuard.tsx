"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingOverlay from "./LoadingOverlay";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/forgot-password', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and trying to access a protected route
      if (!user && !isPublicRoute) {
        router.replace('/');
      }
      
      // If user is authenticated and trying to access an auth page (like login)
      if (user && isPublicRoute) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, pathname, isPublicRoute]);

  // Show loading only during authentication check, not during route transitions
  if (loading) {
    return <LoadingOverlay />;
  }

  // Only render children when appropriate based on auth state and route
  if (!user && !isPublicRoute) {
    return null; // Don't render children while redirecting from protected routes
  }
  
  if (user && isPublicRoute) {
    return null; // Don't render children while redirecting from public routes
  }

  // Otherwise, render the children
  return <>{children}</>;
}