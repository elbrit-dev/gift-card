"use client";

import React from "react";
import Button from "../ui/button/Button";
import { Grid } from "lucide-react";
import { PendingQRRow } from "@/types/qr"; // ✅ Use shared type

interface PendingRowsTableProps {
  pendingRows: PendingQRRow[];
  selectedRows: Record<number, boolean>;
  onSelect: (idx: number) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}

export default function PendingRowsTable({
  pendingRows,
  selectedRows,
  onSelect,
  onSelectAll,
  onGenerate,
}: PendingRowsTableProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-900">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">Uploaded data</h3>
        <Button onClick={onGenerate}>
          <Grid className="mr-2" /> Generate Selected QR Codes
        </Button>
      </div>
      <div className="p-6.5 overflow-x-auto text-black dark:text-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="text-center border border-gray-300 p-2">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={
                    Object.keys(selectedRows).length === pendingRows.length &&
                    pendingRows.length > 0
                  }
                  aria-label="Select All"
                />
              </th>
              <th className="text-center border border-gray-300 p-2">CARD NUMBER</th>
              <th className="text-left border border-gray-300 p-2">SL</th>
              <th className="text-left border border-gray-300 p-2">KIT</th>
              <th className="text-left border border-gray-300 p-2">EXPIRY</th>
              <th className="text-left border border-gray-300 p-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {pendingRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center border border-gray-300 p-2">
                  No pending rows
                </td>
              </tr>
            )}
            {pendingRows.map((row, idx) => (
              <tr key={idx}>
                <td className="text-center border border-gray-200 p-2">
                  <input
                    type="checkbox"
                    checked={!!selectedRows[idx]}
                    onChange={() => onSelect(idx)}
                    aria-label={`Select row ${idx + 1}`}
                  />
                </td>
                <td className="text-center border border-gray-200 p-2">{row.cardNo}</td>
                <td className="border border-gray-200 p-2">{row.serial}</td>
                <td className="border border-gray-200 p-2">{row.tin}</td>
                <td className="border border-gray-200 p-2">{row.expiry}</td>
                <td className="border border-gray-200 p-2">
                  <span className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
