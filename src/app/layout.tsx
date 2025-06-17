"use client";

import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/auth/msalInstance";
import AuthProvider from '@/auth/AuthProvider';
import AuthGuard from "@/components/AuthGuard";

// Add this at the top
export const metadata = {
  title: "Gift Card Management",
  description: "Elbrit Gift Card Portal",
  icons: {
    icon: "/images/image.jpeg", // ✅ path to your custom favicon
  },
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <MsalProvider instance={msalInstance}>
          <UserProvider>
            <AuthProvider>
              <AuthGuard>
                <ThemeProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </ThemeProvider>
              </AuthGuard>
            </AuthProvider>
          </UserProvider>
        </MsalProvider>
      </body>
    </html>
  );
}
