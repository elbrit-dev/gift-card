"use client";
import React from "react";

// Move these into tailwind.config.js if used in many places
const DARK_BLUE_TEXT = "text-[#1B263B]";
const DARK_BG = "dark:bg-[#161D29]";
const DARK_TEXT = "dark:text-white";
const DARK_BORDER = "dark:border-gray-700";
const BUTTON_DARKBLUE =
  "bg-[#1B263B] hover:bg-[#122040] text-white font-semibold";
const INPUT_DARK =
  "dark:bg-[#212A3A] dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400";

export default function BulkControlsSection({
  allSelected,
  selectedCount,
  onSelectAll,
  bulkInput,
  setBulkInput,
  onBulkSelect,
  searchTerm,
  setSearchTerm,
  onSearch,
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-5 shadow-sm ${DARK_BG} ${DARK_BORDER}`}>
      {/* Top Row: Select All & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Select All */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="form-checkbox h-5 w-5 accent-[#1B263B]"
          />
          <span className={`font-medium text-sm ${DARK_BLUE_TEXT} ${DARK_TEXT}`}>
            Select All <span className="mx-1">|</span> {selectedCount} selected
          </span>
        </div>
        {/* Search Gift Cards */}
        <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search gift cards..."
            className={`border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B263B] w-full sm:w-64 md:w-80 bg-white ${INPUT_DARK}`}
          />
          <button
            className={`${BUTTON_DARKBLUE} px-5 py-2 rounded text-sm transition w-full xs:w-auto`}
            onClick={onSearch}
            type="button"
          >
            &#128269; Filter
          </button>
        </div>
      </div>
      {/* Second Row: Bulk Select */}
      <div className="flex flex-col md:flex-row md:items-start gap-3">
        <label
          className={`text-sm font-medium mt-2 md:mt-0 ${DARK_BLUE_TEXT} ${DARK_TEXT}`}
        >
          Bulk Select by Gift Card Numbers:
        </label>
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={bulkInput}
            onChange={e => setBulkInput(e.target.value)}
            placeholder="Enter card numbers separated by commas"
            className={`border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B263B] bg-white w-full ${INPUT_DARK}`}
          />
          <span className="text-xs text-gray-500 mt-1 dark:text-gray-300">
            Enter multiple gift card numbers separated by commas to select them in bulk
          </span>
        </div>
        <button
          className={`${BUTTON_DARKBLUE} px-6 py-2 rounded text-sm transition w-full md:w-auto`}
          style={{ minWidth: 100 }}
          onClick={onBulkSelect}
          type="button"
        >
          &#10003; Select
        </button>
      </div>
    </div>
  );
}
