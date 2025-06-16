"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Grid, Trash2 } from "lucide-react";
import { GeneratedQRRow } from "@/types/qr"; // ✅ import the shared type

interface GeneratedQRCodesTableProps {
  generatedQRCodes: GeneratedQRRow[];
  onDownloadQR: (idx: number) => void;
  onPrintQR: (idx: number) => void;
  onDeleteQR: (idx: number) => void;
}

export default function GeneratedQRCodesTable({
  generatedQRCodes,
  onDownloadQR,
  onPrintQR,
  onDeleteQR,
}: GeneratedQRCodesTableProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-[#161D29]">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Generated QR Codes</h3>
      </div>
      <div className="p-6.5 overflow-x-auto text-black dark:text-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="text-left border border-gray-300 p-2">CARD NUMBER</th>
              <th className="text-left border border-gray-300 p-2">TIN</th>
              <th className="text-left border border-gray-300 p-2">SERIAL</th>
              <th className="text-left border border-gray-300 p-2">EXPIRY</th>
              <th className="text-left border border-gray-300 p-2">QR CODE</th>
              <th className="text-left border border-gray-300 p-2">GENERATED DATE</th>
              <th className="text-left border border-gray-300 p-2">SOURCE</th>
              <th className="text-left border border-gray-300 p-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {generatedQRCodes.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center border border-gray-300 p-2">
                  No QR codes generated
                </td>
              </tr>
            )}
            {generatedQRCodes.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-gray-200 p-2">{row.cardNo}</td>
                <td className="border border-gray-200 p-2">{row.tin}</td>
                <td className="border border-gray-200 p-2">{row.serial}</td>
                <td className="border border-gray-200 p-2">{row.expiry}</td>
                <td className="border border-gray-200 p-2" style={{ position: "relative" }}>
                  <QRCodeCanvas
                    id={`qr-canvas-${idx}`}
                    value={row.qr}
                    size={100}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                  />
                  <div
                    id={`qr-print-block-${idx}`}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: 0,
                      background: "#fff",
                      borderRadius: 16,
                      width: 260,
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    <QRCodeCanvas
                      value={row.qr}
                      size={220}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                    />
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: 22,
                        marginTop: 16,
                        color: "#19223E",
                        letterSpacing: 2,
                      }}
                    >
                      {row.cardNo}
                    </div>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 16,
                        marginTop: 4,
                        color: "#374151",
                      }}
                    >
                      KIT: {row.tin}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-200 p-2">{row.generatedDate}</td>
                <td className="border border-gray-200 p-2">{row.source}</td>
                <td className="border border-gray-200 p-2">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      title="Download QR"
                      onClick={() => onDownloadQR(idx)}
                    >
                      <Download />
                    </button>
                    <button
                      className="hover:text-primary"
                      title="Print PDF"
                      onClick={() => onPrintQR(idx)}
                    >
                      <Grid />
                    </button>
                    <button
                      className="hover:text-primary"
                      title="Delete"
                      onClick={() => onDeleteQR(idx)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <p>
            Showing {generatedQRCodes.length} of {generatedQRCodes.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}
