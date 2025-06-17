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
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    cardNo: "",
    status: "",
  });

  const handleFilterChange = (key: "cardNo" | "status", value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filteredCards = cards
    .filter((card) => card.status !== "active" && card.status !== "drscanned")
    .filter((card) =>
      card.cardNo.toLowerCase().includes(filters.cardNo.toLowerCase())
    )
    .filter((card) =>
      filters.status ? card.status.toLowerCase() === filters.status.toLowerCase() : true
    )
    .map((card) => ({
      ...card,
      expiry: card.expiryDate || "--",
    }));

  const totalPages = Math.ceil(filteredCards.length / pageSize);
  const pagedCards = filteredCards.slice((page - 1) * pageSize, page * pageSize);
  const allCardNos = filteredCards.map((card) => card.cardNo);
  const allSelected = allCardNos.length > 0 && allCardNos.every((id) => selectedCards.includes(id));

  const toggleSelectAll = () => {
    setSelectedCards(allSelected ? [] : allCardNos);
  };

  const toggleSelect = (cardNo: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardNo) ? prev.filter((id) => id !== cardNo) : [...prev, cardNo]
    );
  };

  const escapeCSV = (value: string) => {
    if (!value) return "";
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const downloadSelectedAsCSV = () => {
    const selectedData = filteredCards.filter((card) => selectedCards.includes(card.cardNo));
    const csv = [
      [
        "Gift Card No", "Sales Team", "HQ", "Status",
        "Doctor Name", "Doctor Phone", "Employee Name",
        "Employee Designation", "Employee Phone", "Expiry", "QRCODE"
      ],
      ...selectedData.map((c) =>
        [
          c.cardNo, c.salesTeam, c.hq, c.status,
          c.drName, c.drPhoneNumber, c.empName,
          c.designation, c.empPhone, c.expiry, c.qr,
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

  const statusOptions = Array.from(new Set(cards.map((c) => c.status)))
    .filter((status) => status !== "active" && status !== "drscanned");

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cards in Progress Activation</h2>
        <div className="flex gap-2">
          <button
            className="text-sm px-4 py-1 rounded bg-gray-200 text-black hover:bg-gray-300"
            onClick={() => setFilterPanelOpen((prev) => !prev)}
          >
            {filterPanelOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={downloadSelectedAsCSV}
            disabled={selectedCards.length === 0}
          >
            Download Selected
          </button>
        </div>
      </div>

      {filterPanelOpen && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Card No"
            value={filters.cardNo}
            onChange={(e) => handleFilterChange("cardNo", e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <div className="flex flex-wrap gap-2 items-center">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() =>
                  handleFilterChange("status", filters.status === status ? "" : status)
                }
                className={`px-3 py-1 rounded-full border ${
                  filters.status === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } border-gray-300 text-sm`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1300px] w-full text-sm md:text-base border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                {[
                  "Gift Card No", "Sales Team", "HQ", "Status",
                  "Doctor Name", "Doctor Phone", "Employee Name",
                  "Employee Designation", "Employee Phone", "Expiry", "QR Code"
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
                  <td colSpan={12} className="text-center py-6 text-gray-400 dark:text-gray-500 font-medium border border-gray-200 dark:border-gray-700">
                    No cards in progress
                  </td>
                </tr>
              ) : (
                pagedCards.map((card, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.cardNo)}
                        onChange={() => toggleSelect(card.cardNo)}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-sm break-all border dark:border-gray-700">{card.cardNo}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.salesTeam}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.hq}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">
                      <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold tracking-wide shadow-sm">
                        {card.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.drName}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.drPhoneNumber}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.empName}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.designation}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.empPhone}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">{card.expiry}</td>
                    <td className="px-3 py-2 border dark:border-gray-700">
                      {card.qr ? (
                        <img
                          src={card.qr}
                          alt="QR"
                          className="h-12 w-12 object-contain cursor-pointer"
                          onClick={() => setModalQR(card.qr)}
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
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
          className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto"
          onClick={() => setModalQR(null)}
        >
          <div
            className="bg-white p-5 rounded-lg relative shadow-xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
              onClick={() => setModalQR(null)}
            >
              ×
            </button>
            <img
              src={modalQR}
              width={200}
              alt="QR Enlarged"
              className="object-contain mb-4"
            />
            <p className="text-sm font-semibold text-gray-700 mb-1">WhatsApp Message Link:</p>
            <input
              type="text"
              value={new URL(modalQR).searchParams.get("data") || ""}
              readOnly
              className="w-full text-xs p-2 rounded border border-gray-300 bg-gray-50 font-mono text-gray-700"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default InProgressCardsTable;
