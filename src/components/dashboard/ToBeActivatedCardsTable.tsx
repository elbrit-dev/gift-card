"use client";
import React, { useState } from "react";

interface ToBeActivatedCard {
  cardNo: string;
  kit: string;
  sl: string;
  salesTeam: string;
  hq: string;
  status: string;
  drName: string;
  drPhoneNumber: string;
  verifyName: string;
  empName: string;
  designation: string;
  empPhone: string;
  expiryDate: string;
  qr?: string; // Optional QR string data
  expiry?: string;
}

interface ToBeActivatedCardsTableProps {
  cards?: ToBeActivatedCard[];
  pageSize?: number;
  title?: string;
}

const ToBeActivatedCardsTable: React.FC<ToBeActivatedCardsTableProps> = ({
  cards = [],
  pageSize = 5,
  title = "Cards To Be Activated",
}) => {
  const [page, setPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [modalQR, setModalQR] = useState<string | null>(null); // For popup

  const formattedCards = cards.map((card) => ({
    ...card,
    expiry: card.expiryDate || "--",
  }));

  const totalPages = Math.ceil(formattedCards.length / pageSize);
  const pagedCards = formattedCards.slice((page - 1) * pageSize, page * pageSize);

  const allCardNos = formattedCards.map((card) => card.cardNo);
  const allSelected = allCardNos.length > 0 && allCardNos.every((id) => selectedCards.includes(id));

  const toggleSelectAll = () => {
    setSelectedCards(allSelected ? [] : allCardNos);
  };

  const toggleSelect = (cardNo: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardNo) ? prev.filter((id) => id !== cardNo) : [...prev, cardNo]
    );
  };

  const downloadSelectedAsCSV = () => {
    const selectedData = formattedCards.filter((card) => selectedCards.includes(card.cardNo));
    const csv = [
      [
        "Gift Card No", "Kit", "SL", "Sales Team", "HQ", "Status",
        "Dr Name", "Dr Phone", "Verify Name", "Emp Name", "Emp Designation",
        "Emp Phone", "Expiry", "QR Data"
      ],
      ...selectedData.map((c) => [
        c.cardNo, c.kit, c.sl, c.salesTeam, c.hq, c.status,
        c.drName, c.drPhoneNumber, c.verifyName, c.empName,
        c.designation, c.empPhone, c.expiry, c.qr || ""
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "to_be_activated_cards.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
          {title}
          <button
            className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={downloadSelectedAsCSV}
            disabled={selectedCards.length === 0}
          >
            Download Selected
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="text-sm min-w-[1300px] w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                {[
                  "Gift Card No", "Kit", "SL", "Sales Team", "HQ", "Status",
                  "Dr Name", "Dr Phone", "Verify Name", "Emp Name", "Emp Designation",
                  "Emp Phone", "Expiry", "QR"
                ].map((title, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-2 font-medium text-left text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
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
                    colSpan={15}
                    className="text-center py-6 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
                  >
                    No cards to show
                  </td>
                </tr>
              ) : (
                pagedCards.map((card, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-800 dark:text-white"
                  >
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.cardNo)}
                        onChange={() => toggleSelect(card.cardNo)}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono break-all text-center border border-gray-200 dark:border-gray-700">{card.cardNo || "--"}</td>
                    <td className="px-3 py-2 font-mono break-all text-center border border-gray-200 dark:border-gray-700">{card.kit || "--"}</td>
                    <td className="px-3 py-2 font-mono break-all text-center border border-gray-200 dark:border-gray-700">{card.sl || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.salesTeam || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.hq || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                        {card.status || "--"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{card.drName || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.drPhoneNumber || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.verifyName || "--"}</td>
                    <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{card.empName || "--"}</td>
                    <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">{card.designation || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.empPhone || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">{card.expiry || "--"}</td>
                    <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                      {card.qr ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(card.qr)}`}
                          alt="QR"
                          className="h-12 w-12 object-contain cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setModalQR(card.qr || "");
                          }}
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

      {/* Modal Popup for QR */}
      {modalQR && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg relative shadow-xl max-w-sm w-full">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
              onClick={() => setModalQR(null)}
            >
              ×
            </button>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(modalQR)}`}
              alt="QR Enlarged"
              className="w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ToBeActivatedCardsTable;
