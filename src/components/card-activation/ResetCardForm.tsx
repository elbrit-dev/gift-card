"use client";
import React, { useState } from "react";

export default function ResetCardForm() {
  const [cardNo, setCardNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!cardNo.trim()) {
      setMessage("Card number is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Step 1: Reset the card
      const res = await fetch("/api/cards/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "reset", cardNos: [cardNo] }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to reset card");

      // Step 2: Get user info
      const storedUser = localStorage.getItem("logged_in_user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      // Step 3: Log the activity
      if (user?.email && user?.name) {
        await fetch("/api/cards/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardNos: [cardNo],
            user: {
              name: user.name,
              email: user.email,
            },
          }),
        });
      }

      setMessage(`Card ${cardNo} reset successfully.`);
      setCardNo("");
    } catch (err: any) {
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1d25] rounded-lg p-4 mt-6 shadow-sm max-w-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Reset Card</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Enter the card number to reset its values to default (initial) state.
      </p>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter Card No"
          value={cardNo}
          onChange={(e) => setCardNo(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2f39] text-sm text-gray-800 dark:text-white"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset"}
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-blue-600 dark:text-blue-300">{message}</p>}
    </div>
  );
}
