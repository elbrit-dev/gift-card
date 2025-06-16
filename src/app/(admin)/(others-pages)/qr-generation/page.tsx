"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import UploadExcelSection from "../../../../components/qr/UploadExcelSection";
import ManualEntrySection from "../../../../components/qr/ManualEntrySection";
import PendingRowsTable from "../../../../components/qr/PendingRowsTable";
import GeneratedQRCodesTable from "../../../../components/qr/GeneratedQRCodesTable";

import { QRRow, PendingQRRow, GeneratedQRRow } from "@/types/qr";

// --- Initial Manual Entry State ---
const initialManualState: QRRow = {
  cardNo: "",
  tin: "",
  serial: "",
  expiry: "",
};

export default function QRGenerationPage() {
  const [pendingRows, setPendingRows] = useState<PendingQRRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [manualEntry, setManualEntry] = useState<QRRow>(initialManualState);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<GeneratedQRRow[]>([]);
  const [fileName, setFileName] = useState("");

  const handleRowsAdd = (rows: PendingQRRow[]) => {
    setPendingRows((prev) => {
      const existingCardNos = new Set(prev.map((row) => row.cardNo));
      const newRows = rows.filter((row) => !existingCardNos.has(row.cardNo));
      if (newRows.length < rows.length) {
        alert("Some card numbers were already present and skipped.");
      }
      return [...prev, ...newRows];
    });
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (value: string) => {
    setManualEntry((prev) => ({
      ...prev,
      expiry: value,
    }));
  };

  const generateQRString = (row: QRRow): string => {
    const message = `Card Number: ${row.cardNo}
TIN: ${row.tin}
Serial: ${row.serial}
Expiry: ${row.expiry}`;
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/919363495893?text=${encodedMsg}`;
  };

  const saveToDB = async (data: any) => {
    try {
      await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Failed to insert card in DB", err);
    }
  };

  const handleManualAdd = async () => {
    const { cardNo, tin, serial, expiry } = manualEntry;

    if (!cardNo || !tin || !serial || !expiry) {
      alert("All fields required");
      return;
    }

    if (generatedQRCodes.some((row) => row.cardNo === cardNo)) {
      alert("This card number already exists in generated QR codes!");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const qrString = generateQRString(manualEntry);
    const formattedExpiry = /^\d{4}-\d{2}$/.test(expiry) ? expiry + "-01" : expiry;

    const payload = {
      cardNo,
      kit: tin,
      SL: serial,
      expiry: formattedExpiry,
      qr: qrString,
    };

    try {
      await saveToDB(payload);
    } catch (err: any) {
      alert("Failed to save to DB: " + (err?.message || err));
      return;
    }

    setGeneratedQRCodes((prev) => [
      ...prev,
      {
        ...manualEntry,
        expiry: formattedExpiry,
        status: "Generated",
        source: "Manual",
        generatedDate: today,
        qr: qrString,
      },
    ]);
    setManualEntry(initialManualState);
  };

  const handleRowSelect = (idx: number) => {
    setSelectedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const all: Record<number, boolean> = {};
      pendingRows.forEach((_, idx) => (all[idx] = true));
      setSelectedRows(all);
    } else {
      setSelectedRows({});
    }
  };

  const handleGenerateSelectedQRCodes = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const selected = pendingRows
      .map((row, idx) => ({ ...row, idx }))
      .filter((_, idx) => selectedRows[idx]);

    if (!selected.length) {
      alert("Select at least one row");
      return;
    }

    const newGenerated: GeneratedQRRow[] = [];
    for (const row of selected) {
      const qrString = generateQRString(row);

      await saveToDB({
        cardNo: row.cardNo,
        kit: row.tin,
        SL: row.serial,
        expiry: row.expiry,
        qr: qrString,
      });

      newGenerated.push({
        ...row,
        generatedDate: today,
        qr: qrString,
      });
    }

    setGeneratedQRCodes((prev) => [...prev, ...newGenerated]);
    setPendingRows((prev) => prev.filter((_, idx) => !selectedRows[idx]));
    setSelectedRows({});
  };

  const handleDownloadQR = (idx: number) => {
    const qrBlock = document.getElementById(`qr-print-block-${idx}`);
    if (!qrBlock) return;
    html2canvas(qrBlock, { scale: 2, backgroundColor: "#fff" }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handlePrintQR = (idx: number) => {
    const qrBlock = document.getElementById(`qr-print-block-${idx}`);
    if (!qrBlock) return;
    html2canvas(qrBlock, { scale: 2, backgroundColor: "#fff" }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("qr-code.pdf");
    });
  };

  const handleDeleteQR = (idx: number) => {
    setGeneratedQRCodes((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">QR Code Generation</h2>
      <p className="text-gray-600 mb-6 dark:text-gray-300">
        Upload data, generate QR and manage them effectively
      </p>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <UploadExcelSection
            onRowsAdd={handleRowsAdd}
            fileName={fileName}
            setFileName={setFileName}
          />
          <ManualEntrySection
            manualEntry={manualEntry}
            onChange={handleManualChange}
            onDateChange={handleDateChange}
            onAdd={handleManualAdd}
          />
        </div>

        <div className="flex flex-col gap-9 sm:col-span-2">
          <PendingRowsTable
            pendingRows={pendingRows}
            selectedRows={selectedRows}
            onSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            onGenerate={handleGenerateSelectedQRCodes}
          />

          <GeneratedQRCodesTable
            generatedQRCodes={generatedQRCodes}
            onDownloadQR={handleDownloadQR}
            onPrintQR={handlePrintQR}
            onDeleteQR={handleDeleteQR}
          />
        </div>
      </div>
    </>
  );
}
