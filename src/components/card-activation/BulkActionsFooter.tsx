"use client";
import React from "react";

interface BulkActionsFooterProps {
  selectedCount: number;
  onExport: () => void;
  onActivate: () => void;
  isActivating: boolean;
}

export default function BulkActionsFooter({
  selectedCount,
  onExport,
  onActivate,
  isActivating,
}: BulkActionsFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-6 gap-3 bg-white dark:bg-[#161D29] p-3 sm:p-4 rounded-b-lg">
      <span className="text-sm text-gray-700 dark:text-gray-200">
        {selectedCount} gift card{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-[#212A3A] hover:bg-gray-50 dark:hover:bg-[#2C3543] text-gray-800 dark:text-gray-100 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
          onClick={onExport}
          disabled={selectedCount === 0}
        >
          Export Selected
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition w-full sm:w-auto ${
            selectedCount > 0 && !isActivating
              ? "bg-[#1B263B] hover:bg-[#122040] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedCount === 0 || isActivating}
          onClick={onActivate}
        >
          {isActivating ? "Activating..." : "Activate Selected"}
        </button>
      </div>
    </div>
  );
}
