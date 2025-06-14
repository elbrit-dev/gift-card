"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/auth/msalInstance";
import AuthProvider from "@/auth/AuthProvider";
import AuthGuard from "@/components/AuthGuard";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider><AuthGuard>{children}</AuthGuard></AuthProvider>
    </MsalProvider>
  );
}
