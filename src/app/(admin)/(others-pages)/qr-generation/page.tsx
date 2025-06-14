"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import UploadExcelSection from "../../../../components/qr/UploadExcelSection";
import ManualEntrySection from "../../../../components/qr/ManualEntrySection";
import PendingRowsTable from "../../../../components/qr/PendingRowsTable";
import GeneratedQRCodesTable from "../../../../components/qr/GeneratedQRCodesTable";

// Initial state for manual entry fields
const initialManualState = {
  cardNo: "",
  tin: "",
  serial: "",
  expiry: "",
};

export default function QRGenerationPage() {
  const [pendingRows, setPendingRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [manualEntry, setManualEntry] = useState(initialManualState);
  const [generatedQRCodes, setGeneratedQRCodes] = useState([]);
  const [fileName, setFileName] = useState("");

  // --- 1. Add Excel rows to pending ---
  const handleRowsAdd = (rows) => {
    setPendingRows((prev) => {
      const existingCardNos = new Set(prev.map((row) => row.cardNo));
      const newRows = rows.filter((row) => !existingCardNos.has(row.cardNo));
      if (newRows.length < rows.length) {
        alert("Some card numbers were already present and skipped.");
      }
      return [...prev, ...newRows];
    });
  };

  // --- 2. Manual input handlers ---
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (value) => {
    setManualEntry((prev) => ({
      ...prev,
      expiry: value,
    }));
  };

  // --- 2.1. Utility: Generate WhatsApp QR deeplink ---
  const generateQRString = (row) => {
    const message = `Card Number: ${row.cardNo}
    TIN: ${row.tin}
    Serial: ${row.serial}
    Expiry: ${row.expiry}`;
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/919363495893?text=${encodedMsg}`;
  };

  // --- 2.3. Utility: Save data to backend ---
  const saveToDB = async (data) => {
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

  // --- 3. Manual Add (Generate QR & Save) ---
  const handleManualAdd = async () => {
    if (
      !manualEntry.cardNo ||
      !manualEntry.tin ||
      !manualEntry.serial ||
      !manualEntry.expiry
    ) {
      alert("All fields required");
      return;
    }
    if (generatedQRCodes.some((row) => row.cardNo === manualEntry.cardNo)) {
      alert("This card number already exists in generated QR codes!");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const qrString = generateQRString(manualEntry);

    // Always standardize expiry as YYYY-MM-DD
    let expiry = manualEntry.expiry;
    if (/^\d{4}-\d{2}$/.test(expiry)) {
      expiry = expiry + "-01";
    }

    const payload = {
      cardNo: manualEntry.cardNo,
      kit: manualEntry.tin,
      SL: manualEntry.serial,
      expiry,
      qr: qrString,
    };

    try {
      await saveToDB(payload);
    } catch (err) {
      alert("Failed to save to DB: " + (err?.message || err));
      return;
    }

    setGeneratedQRCodes((prev) => [
      ...prev,
      {
        ...manualEntry,
        expiry,
        status: "Generated",
        source: "Manual",
        generatedDate: today,
        qr: qrString,
      },
    ]);
    setManualEntry(initialManualState);
  };

  // --- 4. Pending table selection ---
  const handleRowSelect = (idx) => {
    setSelectedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const all = {};
      pendingRows.forEach((_, idx) => (all[idx] = true));
      setSelectedRows(all);
    } else {
      setSelectedRows({});
    }
  };

  // --- 5. Generate QR Codes from selected pending rows ---
  const handleGenerateSelectedQRCodes = async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    const selected = pendingRows
      .map((row, idx) => ({ ...row, idx }))
      .filter((_, idx) => selectedRows[idx]);

    if (!selected.length) {
      alert("Select at least one row");
      return;
    }

    const newGenerated = [];
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

  // --- 6. Download QR as PNG ---
  const handleDownloadQR = (idx) => {
    const qrBlock = document.getElementById(`qr-print-block-${idx}`);
    if (!qrBlock) return;
    html2canvas(qrBlock, { scale: 2, backgroundColor: "#fff" }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // --- 7. Print QR as PDF ---
  const handlePrintQR = (idx) => {
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

  // --- 8. Delete QR ---
  const handleDeleteQR = (idx) => {
    setGeneratedQRCodes((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---- MAIN RENDER ----
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">QR Code Generation</h2>
      <p className="text-gray-600 mb-6 dark:text-gray-320">
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
