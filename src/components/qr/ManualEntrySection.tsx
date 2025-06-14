"use client";
import React from "react";
import Button from "../ui/button/Button";
import { Grid } from "lucide-react";

export default function ManualEntrySection({
  manualEntry,
  onChange,
  onDateChange,
  onAdd,
}) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-[#161D29]">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Manual Entry</h3>
      </div>
      <div className="p-6.5">
        <form
          className="flex flex-row gap-4 items-end flex-wrap"
          onSubmit={e => { e.preventDefault(); onAdd(); }}
        >
          {/* Card Number */}
          <div className="flex flex-col min-w-[170px] flex-1">
            <label className="mb-1 text-black dark:text-white font-medium text-sm">
              Card Number
            </label>
            <input
              type="text"
              name="cardNo"
              value={manualEntry.cardNo}
              onChange={onChange}
              placeholder="Enter card number"
              className="w-full px-3 py-2 border border-stroke rounded bg-gray-50 text-black text-base dark:border-strokedark dark:bg-[#212A3A] dark:text-white dark:placeholder:text-gray-400 outline-none"
            />
          </div>
          {/* TIN */}
          <div className="flex flex-col min-w-[140px] flex-1">
            <label className="mb-1 text-black dark:text-white font-medium text-sm">
              TIN
            </label>
            <input
              type="text"
              name="tin"
              value={manualEntry.tin}
              onChange={onChange}
              placeholder="Enter TIN"
              className="w-full px-3 py-2 border border-stroke rounded bg-gray-50 text-black text-base dark:border-strokedark dark:bg-[#212A3A] dark:text-white dark:placeholder:text-gray-400 outline-none"
            />
          </div>
          {/* Serial */}
          <div className="flex flex-col min-w-[140px] flex-1">
            <label className="mb-1 text-black dark:text-white font-medium text-sm">
              Serial
            </label>
            <input
              type="text"
              name="serial"
              value={manualEntry.serial}
              onChange={onChange}
              placeholder="Enter serial number"
              className="w-full px-3 py-2 border border-stroke rounded bg-gray-50 text-black text-base dark:border-strokedark dark:bg-[#212A3A] dark:text-white dark:placeholder:text-gray-400 outline-none"
            />
          </div>
          {/* Expiry Month-Year */}
          <div className="flex flex-col min-w-[160px] flex-1">
            <label className="mb-1 text-black dark:text-white font-medium text-sm">
              Expiry
            </label>
            <input
              type="month"
              name="expiry"
              value={manualEntry.expiry}
              onChange={e => onDateChange(e.target.value)}
              placeholder="MM-YYYY"
              className="w-full px-3 py-2 border border-stroke rounded bg-gray-50 text-black text-base dark:border-strokedark dark:bg-[#212A3A] dark:text-white dark:placeholder:text-gray-400 outline-none"
              style={{ minWidth: 120 }}
            />
          </div>
          {/* Button */}
          <div className="flex flex-col min-w-[180px] flex-shrink-0">
            <Button
              className="w-full py-2 mt-4 font-semibold"
              type="submit"
            >
              <Grid className="mr-2" /> Generate QR Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
