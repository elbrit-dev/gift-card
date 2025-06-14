"use client";

import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

let initialized = false;

const USER_KEY = "logged_in_user"; // Key for localStorage

const AuthProvider = ({ children }) => {
  const { instance } = useMsal();
  const router = useRouter();
  const { user, setUser } = useUser();

  // On first mount, restore from localStorage if possible
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch (e) {
          // If invalid JSON, clear it
          localStorage.removeItem(USER_KEY);
        }
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!initialized) {
          await msalInstance.initialize();
          initialized = true;
        }

        const response = await instance.handleRedirectPromise();
        if (response) {
          const account = response.account;
          instance.setActiveAccount(account);

          const userObj = {
            name: account.name,
            email: account.username,
          };

          setUser(userObj);
          // Save to localStorage
          localStorage.setItem(USER_KEY, JSON.stringify(userObj));

          // Clean up the URL after successful login redirect
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          router.push("/");
        }
      } catch (err) {
        console.error("MSAL Redirect Error", err);
      }
    };

    run();
  }, [instance, router, setUser]);

  return children;
};

export default AuthProvider;
