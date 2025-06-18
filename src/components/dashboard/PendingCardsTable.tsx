"use client";
import React, { useState } from "react";

interface InProgressCard {
  cardNo: string;
  salesTeam: string;
  hq: string;
  status: string;
  drName: string;
  drPhoneNumber: string;
  empName: string;
  empPhone: string;
  expiryDate: string;
  designation: string;
  qr: string;
}

interface InProgressCardsTableProps {
  cards: InProgressCard[];
  pageSize?: number;
}

const InProgressCardsTable: React.FC<InProgressCardsTableProps> = ({
  cards,
  pageSize = 5,
}) => {
  const [page, setPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [modalQR, setModalQR] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = cards
    .filter((card) => card.status !== "active" && card.status !== "drscanned")
    .filter((card) => {
      const query = searchQuery.toLowerCase();
      return Object.values(card).some((value) =>
        value?.toLowerCase?.().includes(query)
      );
    })
    .map((card) => ({
      ...card,
      expiry: card.expiryDate || "--",
    }));

  const totalPages = Math.ceil(filteredCards.length / pageSize);
  const pagedCards = filteredCards.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const allCardNos = filteredCards.map((card) => card.cardNo);
  const allSelected =
    allCardNos.length > 0 &&
    allCardNos.every((id) => selectedCards.includes(id));

  const toggleSelectAll = () => {
    setSelectedCards(allSelected ? [] : allCardNos);
  };

  const toggleSelect = (cardNo: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardNo)
        ? prev.filter((id) => id !== cardNo)
        : [...prev, cardNo]
    );
  };

  const escapeCSV = (value: string) => {
    if (!value) return "";
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const downloadSelectedAsCSV = () => {
    const selectedData = filteredCards.filter((card) =>
      selectedCards.includes(card.cardNo)
    );
    const csv = [
      [
        "Gift Card No",
        "Sales Team",
        "HQ",
        "Status",
        "Doctor Name",
        "Doctor Phone",
        "Employee Name",
        "Employee Designation",
        "Employee Phone",
        "Expiry",
        "QRCODE",
      ],
      ...selectedData.map((c) =>
        [
          c.cardNo,
          c.salesTeam,
          c.hq,
          c.status,
          c.drName,
          c.drPhoneNumber,
          c.empName,
          c.designation,
          c.empPhone,
          c.expiry,
          c.qr,
        ].map(escapeCSV)
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "in_progress_cards.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-base md:text-lg text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
          <div className="text-lg">Cards in Progress Activation</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            />
            <button
              className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={downloadSelectedAsCSV}
              disabled={selectedCards.length === 0}
            >
              Download Selected
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[1300px] w-full text-sm md:text-base border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                {[
                  "Gift Card No",
                  "Sales Team",
                  "HQ",
                  "Status",
                  "Doctor Name",
                  "Doctor Phone",
                  "Employee Name",
                  "Employee Designation",
                  "Employee Phone",
                  "Expiry",
                  "QR Code",
                ].map((title, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-2 font-semibold text-left text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedCards.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-6 text-gray-400 dark:text-gray-500 font-medium border border-gray-200 dark:border-gray-700"
                  >
                    No cards in progress
                  </td>
                </tr>
              ) : (
                pagedCards.map((card, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700 dark:text-white">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.cardNo)}
                        onChange={() => toggleSelect(card.cardNo)}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-sm break-all border dark:border-gray-700 dark:text-white">
                      {card.cardNo}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.salesTeam}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.hq}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold tracking-wide shadow-sm">
                        {card.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.drName}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.drPhoneNumber}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.empName}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.designation}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.empPhone}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.expiry}
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700 dark:text-white">
                      {card.qr ? (
                        <img
                          src={card.qr}
                          alt="QR"
                          className="h-12 w-12 object-contain cursor-pointer"
                          onClick={() => setModalQR(card.qr)}
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-white">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </div>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modalQR && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm px-4"
          onClick={() => setModalQR(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setModalQR(null)}
            >
              &times;
            </button>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <img
                src={modalQR}
                alt="QR Code"
                className="h-56 w-56 object-contain rounded-xl border border-gray-200 shadow-md"
              />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-3">
              WhatsApp Message Link
            </h2>

            {/* Extracted Link */}
            {(() => {
              try {
                const link = new URL(modalQR).searchParams.get("data");
                return link ? (
                  <div className="text-center">
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        alert("✅ Full link copied to clipboard");
                      }}
                      title={link}
                      className="cursor-pointer text-sm text-green-600 dark:text-green-400 max-w-full truncate bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg font-mono inline-block"
                    >
                      {link}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to copy full link</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600 text-center">Invalid link</p>
                );
              } catch {
                return <p className="text-sm text-red-600 text-center">Invalid QR URL</p>;
              }
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default InProgressCardsTable;
