"use client";
import React, { useState } from "react";

interface ToBeActivatedCard {
  cardNo: string;
  salesTeam: string;
  hq: string;
  status: string;
  drName: string;
  drPhoneNumber: string;
  empName: string;
  designation: string;
  empPhone: string;
  expiryDate: string;
  expiry?: string; // Added to avoid TS error when using derived value
}

interface ToBeActivatedCardsTableProps {
  cards?: ToBeActivatedCard[]; // Optional fallback
  pageSize?: number;
}

const ToBeActivatedCardsTable: React.FC<ToBeActivatedCardsTableProps> = ({
  cards = [],
  pageSize = 5,
}) => {
  const [page, setPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const formattedCards = cards
    .filter((card) => card.status === "drscanned")
    .map((card) => ({
      ...card,
      expiry: card.expiryDate || "--",
    }));

  const totalPages = Math.ceil(formattedCards.length / pageSize);
  const pagedCards = formattedCards.slice((page - 1) * pageSize, page * pageSize);

  const allCardNos = formattedCards.map((card) => card.cardNo);
  const allSelected =
    allCardNos.length > 0 && allCardNos.every((id) => selectedCards.includes(id));

  const toggleSelectAll = () => {
    setSelectedCards(allSelected ? [] : allCardNos);
  };

  const toggleSelect = (cardNo: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardNo) ? prev.filter((id) => id !== cardNo) : [...prev, cardNo]
    );
  };

  const downloadSelectedAsCSV = () => {
    const selectedData = formattedCards.filter((card) =>
      selectedCards.includes(card.cardNo)
    );
    const csv = [
      [
        "Gift Card No",
        "Sales Team",
        "HQ",
        "Status",
        "Dr Name",
        "Dr Phone",
        "Emp Name",
        "Emp Designation",
        "Emp Phone",
        "Expiry",
      ],
      ...selectedData.map((c) => [
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto shadow-sm">
      <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
        Under Verification Cards To Be Activated
        <button
          className="text-sm px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={downloadSelectedAsCSV}
          disabled={selectedCards.length === 0}
        >
          Download Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm min-w-[1200px] w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              </th>
              {[
                "Gift Card No",
                "Sales Team",
                "HQ",
                "Status",
                "Dr Name",
                "Dr Phone",
                "Emp Name",
                "Emp Designation",
                "Emp Phone",
                "Expiry",
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
                  colSpan={11}
                  className="text-center py-6 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
                >
                  No cards to be activated
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
                  <td className="px-3 py-2 font-mono break-all text-center border border-gray-200 dark:border-gray-700">
                    {card.cardNo || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    {card.salesTeam || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    {card.hq || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                      {card.status || "--"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">
                    {card.drName || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    {card.drPhoneNumber || "--"}
                  </td>
                  <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">
                    {card.empName || "--"}
                  </td>
                  <td className="px-3 py-2 text-left border border-gray-200 dark:border-gray-700">
                    {card.designation || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    {card.empPhone || "--"}
                  </td>
                  <td className="px-3 py-2 text-center border border-gray-200 dark:border-gray-700">
                    {card.expiry || "--"}
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
  );
};

export default ToBeActivatedCardsTable;
