"use client";

import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

let initialized = false;
const USER_KEY = "logged_in_user";

const AuthProvider = ({ children }) => {
  const { instance } = useMsal();
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isMsalReady, setMsalReady] = useState(false);

  // 1. Initialize MSAL instance only once
  useEffect(() => {
    if (!initialized) {
      msalInstance.initialize().then(() => {
        initialized = true;
        setMsalReady(true);
      });
    } else {
      setMsalReady(true);
    }
  }, []);

  // 2. Restore user from MSAL if available
  useEffect(() => {
    if (!isMsalReady || !instance) return;

    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
      const userObj = {
        name: accounts[0].name,
        email: accounts[0].username,
      };
      setUser(userObj);
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    }
  }, [isMsalReady, instance, setUser]);

  // 3. Restore user context from localStorage (UI fallback)
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch{
          localStorage.removeItem(USER_KEY);
        }
      }
    }
  }, [user, setUser]);

  // 4. Handle redirect login result
  useEffect(() => {
    if (!isMsalReady || !instance) return;

    const run = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          const account = response.account;
          instance.setActiveAccount(account);
          const userObj = {
            name: account.name,
            email: account.username,
          };
          setUser(userObj);
          localStorage.setItem(USER_KEY, JSON.stringify(userObj));
          // Clean up redirect hash
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
  }, [isMsalReady, instance, router, setUser]);

  // 5. Show nothing (or loader) while MSAL initializes
  if (!isMsalReady) {
    return null;
  }

  return children;
};

export default AuthProvider;
