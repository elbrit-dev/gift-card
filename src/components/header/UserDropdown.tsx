"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useMsal } from "@azure/msal-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Helper to get initial for avatar
const getInitial = (name: string | undefined | null): string =>
  name && typeof name === "string" && name.length > 0
    ? name.charAt(0).toUpperCase()
    : "?";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();
  const { instance } = useMsal();

  function toggleDropdown(e: React.MouseEvent) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // MSAL sign out: removes session and redirects
  async function handleSignOut() {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();

    await instance.logoutRedirect({
      postLogoutRedirectUri: "/signin",
    });
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        {/* Avatar */}
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-2xl font-bold text-[#1B263B] dark:text-white select-none">
          {getInitial(user?.name)}
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name || "Guest"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name || "Guest User"}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || "guest@example.com"}
          </span>
        </div>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit Profile
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
