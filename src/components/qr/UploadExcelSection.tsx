"use client";

import React, { useRef, useState } from "react";
import Button from "../ui/button/Button";
import { Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { PendingQRRow } from "@/types/qr"; // ✅ Use shared type

// --- Constants ---
const EXCEL_TEMPLATE_URL = "/Sample-test.xlsx";

// --- Props Interface ---
interface UploadExcelSectionProps {
  onRowsAdd: (rows: PendingQRRow[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

export default function UploadExcelSection({
  onRowsAdd,
  fileName,
  setFileName,
}: UploadExcelSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Convert Excel date format to ISO string
  function excelDateToISO(serial: any): string {
    if (typeof serial === "number") {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return date_info.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    }
    if (typeof serial === "string" && /^\d{4}-\d{2}$/.test(serial)) {
      return serial + "-01";
    }
    return serial;
  }

  // Handle file input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
  };

  // Triggered by "Upload Data" button
  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const data = await selectedFile.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    const mapped: PendingQRRow[] = rows.map((row) => ({
      cardNo: row["Card Number"] || "",
      tin: row["TIN"] || "",
      serial: row["Serial"] || "",
      expiry: excelDateToISO(row["Expiry"] || ""),
      status: "Pending",
      source: "Upload",
    }));

    onRowsAdd(mapped);

    // Reset file input and file name
    setSelectedFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-[#161D29]">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Data Upload</h3>
      </div>
      <div className="p-6.5">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Download Button */}
          <Button
            variant="outline"
            type="button"
            className="flex-shrink-0 dark:text-white"
            onClick={() => window.open(EXCEL_TEMPLATE_URL, "_blank")}
          >
            <Download className="mr-2 dark:text-white" /> Download Excel Template
          </Button>

          {/* Hidden File Input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            id="file-upload"
            accept=".xlsx"
            onChange={handleFileChange}
          />

          {/* Visible Label for File Input */}
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded border border-stroke bg-gray-100 px-4 py-2 text-black text-sm dark:border-strokedark dark:bg-gray-700 dark:text-white flex-shrink-0"
          >
            Choose File
          </label>

          {/* File Name Display */}
          <input
            type="text"
            readOnly
            tabIndex={-1}
            value={fileName || "No file chosen"}
            className="w-48 min-w-[12rem] max-w-xs px-3 py-2 border border-stroke rounded bg-gray-50 text-gray-600 text-sm dark:border-strokedark dark:bg-[#212A3A] dark:text-white dark:placeholder:text-gray-400 cursor-default"
            style={{ marginLeft: "-6px" }}
          />

          {/* Upload Button */}
          <Button
            type="button"
            className="ml-2 flex-shrink-0"
            onClick={handleUploadClick}
            disabled={!selectedFile}
          >
            <Upload className="mr-2" /> Upload Data
          </Button>
        </div>
      </div>
    </div>
  );
}
