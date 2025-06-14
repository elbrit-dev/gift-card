// components/AuthGuard.js
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthGuard({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in and not on the login page, redirect to /login
    if (!user && pathname !== "/signin" && pathname !== "/signin") {
      router.replace("/signin");
    }
  }, [user, pathname, router]);

  // Optionally show a loading indicator while checking
  if (!user && pathname !== "/signin" && pathname !== "/signin") {
    return null; // or <Spinner /> or <div>Redirecting...</div>
  }

  return children;
}
