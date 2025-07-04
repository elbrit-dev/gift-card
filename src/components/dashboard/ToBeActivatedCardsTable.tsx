"use client";
import React, { useState } from "react";

interface ToBeActivatedCard {
  cardNo: string;
  kit: string;
  SL: string;
  salesTeam: string;
  hq: string;
  status: string;
  drName: string;
  drCode: string;
  drPhoneNumber: string;
  amount: string;
  verifyName: string;
  verifyScore: string;
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
  // const [modalQR, setModalQR] = useState<string | null>(null); // For popup

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
        "Gift Card No", "Kit", "SL", "Sales Team", "HQ", "Status", "Dr Phone", "Dr Code",
        "Dr Name", "Verify Name", "Verify Score", "Amount", "Emp Name", "Emp Designation",
        "Emp Phone", "Expiry", "QR Data"
      ],
      ...selectedData.map((c) => [
        c.cardNo, c.kit, c.SL, c.salesTeam, c.hq, c.status, c.drPhoneNumber, c.drCode,
        c.drName,  c.verifyName, c.verifyScore, c.amount, c.empName,
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
        <table className="text-sm min-w-[1400px] w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-4 min-w-[60px] text-center border border-gray-200 dark:border-gray-700">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              </th>
              {[
                "Gift Card No", "Kit", "SL", "Sales Team", "HQ", "Status", "Dr Phone", "Dr Code",
                "Dr Name", "Verify Name", "Verify Score", "Amount", "Emp Name", "Emp Designation",
                "Emp Phone", "Expiry"
              ].map((title, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 min-w-[120px] font-medium text-left text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
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
                  colSpan={16}
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
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedCards.includes(card.cardNo)}
                      onChange={() => toggleSelect(card.cardNo)}
                    />
                  </td>
                  <td className="px-6 py-4 min-w-[120px] font-mono break-all text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.cardNo || "--"}</td>
                  <td className="px-6 py-4 min-w-[120px] font-mono break-all text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.kit || "--"}</td>
                  <td className="px-6 py-4 min-w-[120px] font-mono break-all text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.SL || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.salesTeam || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.hq || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                      {card.status || "--"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.drPhoneNumber || "--"}</td>
                  <td className="px-6 py-4 text-left border border-gray-200 dark:border-gray-700 dark:text-white">{card.drCode || "--"}</td>
                  <td className="px-6 py-4 text-left border border-gray-200 dark:border-gray-700 dark:text-white">{card.drName || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.verifyName || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">
                    {card.verifyScore !== undefined && card.verifyScore !== null ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          Number(card.verifyScore) >= 76
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : Number(card.verifyScore) >= 41
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {card.verifyScore}%
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left border border-gray-200 dark:border-gray-700 dark:text-white">{card.amount || "--"}</td>
                  <td className="px-6 py-4 text-left border border-gray-200 dark:border-gray-700 dark:text-white">{card.empName || "--"}</td>
                  <td className="px-6 py-4 text-left border border-gray-200 dark:border-gray-700 dark:text-white">{card.designation || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.empPhone || "--"}</td>
                  <td className="px-6 py-4 text-center border border-gray-200 dark:border-gray-700 dark:text-white">{card.expiry || "--"}</td>
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
