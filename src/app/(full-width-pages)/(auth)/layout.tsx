"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/auth/msalInstance";
import AuthProvider from "@/auth/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6  bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
              {children}
              <div className="lg:w-1/2 w-full h-full  dark:bg-white/5 lg:grid items-center hidden">
                <div className="relative items-center justify-center  flex z-1">
                  {/* <!-- ===== Common Grid Shape Start ===== --> */}
                  <GridShape />
                  <div className="flex flex-col items-center max-w-xs">
                    <Image
                      width={231}
                      height={48}
                      src="/images/logo/image.png"
                      alt="Logo"
                      className="block mb-4"
                    />
                  </div>
                </div>
              </div>
              <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                <ThemeTogglerTwo />
              </div>
            </div>
          </AuthProvider>
        </MsalProvider>
      </ThemeProvider>
    </div>
  );
}
