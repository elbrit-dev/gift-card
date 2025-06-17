"use client";
import React, { useState, useMemo } from "react";
import { Clock, X } from "lucide-react";

interface Activity {
  activityType: string;
  cardNo: string;
  by: string;
  extraText?: string;
  timestamp: string;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

// ✅ Updated function for 24-hour IST formatting
function formatDateTime(iso: string) {
  const d = new Date(iso);
  const formatted = d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatted.replace(",", ""); // → "17 Jun 2025 14:50"
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  const INITIAL_COUNT = 8;
  const LOAD_MORE_COUNT = 5;

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const activityTypes = useMemo(() => {
    const unique = Array.from(new Set(activities.map((a) => a.activityType)));
    return ["All", ...unique];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchType = selectedType === "All" || act.activityType === selectedType;
      const matchSearch = [act.cardNo, act.by].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchType && matchSearch;
    });
  }, [activities, searchTerm, selectedType]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  return (
    <div className="bg-white rounded-lg border dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm">
      <div className="px-5 py-3 border-b font-semibold text-base sm:text-lg">
        Recent Activity
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 px-5 pt-3 pb-2 sm:flex-row sm:items-center">
        {/* Dropdown */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setVisibleCount(INITIAL_COUNT);
          }}
          className="w-full sm:w-48 px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700"
        >
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by card no. or user"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(INITIAL_COUNT);
            }}
            className="w-full px-3 py-2 pr-10 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-[10px] text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <ul className="divide-y">
        {filteredActivities.length === 0 && (
          <li className="px-5 py-4 text-gray-400 text-center">No activity found</li>
        )}

        {visibleActivities.map((act, idx) => (
          <li
            key={idx}
            className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3"
          >
            <div className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm sm:text-base">
                  <strong>{act.activityType}</strong> of{" "}
                  <strong>{act.cardNo}</strong> by <strong>{act.by}</strong>
                </div>
                {act.extraText && (
                  <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                    • {act.extraText}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-white sm:ml-auto whitespace-nowrap">
              {formatDateTime(act.timestamp)}
            </span>
          </li>
        ))}
      </ul>

      {hasMore && filteredActivities.length > 0 && (
        <div className="px-5 py-3 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + LOAD_MORE_COUNT)}
            className="text-sm px-4 py-1.5 border rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;
