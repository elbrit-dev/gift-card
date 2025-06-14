"use client";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export default function SignInForm() {
  const { instance, inProgress } = useMsal();

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect({ scopes: ["User.Read"] });
    }
    // else: do nothing (button will be disabled anyway)
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-brand-950">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-white-950 text-title-sm text-white/90 sm:text-title-md">
              Elbrit App Portal
            </h1>
          </div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-white-800 text-title-sm text-white/90 sm:text-title-md">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 text-white-400">
              Sign in to access Elbrit App Portal
            </p>
          </div>
          <div>
            <Button
              className="w-full"
              size="sm"
              onClick={handleLogin}
              disabled={inProgress !== InteractionStatus.None}
            >
              <img
                src="/images/logo/microsoft.png"
                alt="Microsoft Logo"
                width="30"
                height="25"
                className="mr-2"
              />
              {inProgress === InteractionStatus.None
                ? "Sign in with Microsoft"
                : "Signing in..."}
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto mt-auto text-center">
        <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Support</Link>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} QR Generation Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
