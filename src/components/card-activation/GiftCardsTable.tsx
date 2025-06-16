"use client";
import React from "react";

interface Card {
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
  expiry?: string;
  amount: string;
  createdDate: string;
}

interface GiftCardsTableProps {
  cards: Card[];
  selectedCardNos: Set<string>;
  onRowSelect: (cardNoOrAll: string) => void;
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function GiftCardsTable({
  cards,
  selectedCardNos,
  onRowSelect,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}: GiftCardsTableProps) {
  const allSelected = cards.length > 0 && cards.every(card => selectedCardNos.has(card.cardNo));

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <table className="min-w-[1500px] w-full text-sm text-left text-gray-900 dark:text-gray-100">
        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#1f2937] border-b border-gray-300 dark:border-gray-600 text-xs uppercase font-semibold tracking-wide">
          <tr>
            <th className="px-3 py-3"><input type="checkbox" checked={allSelected} onChange={() => onRowSelect("all")} /></th>
            <th className="px-3 py-3">Card No</th>
            <th className="px-3 py-3">KIT</th>
            <th className="px-3 py-3">Serial</th>
            <th className="px-3 py-3">Expiry</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">HQ</th>
            <th className="px-3 py-3">Sales Team</th>
            <th className="px-3 py-3">Dr Name</th>
            <th className="px-3 py-3">Dr Phone</th>
            <th className="px-3 py-3">Verify Name</th>
            <th className="px-3 py-3">Emp Name</th>
            <th className="px-3 py-3">Emp Phone</th>
            <th className="px-3 py-3">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {cards.length === 0 ? (
            <tr>
              <td colSpan={15} className="py-6 text-center text-gray-400 dark:text-gray-500">
                No cards found
              </td>
            </tr>
          ) : (
            cards.map((card, index) => (
              <tr
                key={card.cardNo}
                className={`transition-all ${
                  index % 2 === 0 ? "bg-white dark:bg-[#1a1d25]" : "bg-gray-50 dark:bg-[#212836]"
                } hover:bg-gray-100 dark:hover:bg-[#2b3545]`}
              >
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selectedCardNos.has(card.cardNo)} onChange={() => onRowSelect(card.cardNo)} />
                </td>
                <td className="px-3 py-3">{card.cardNo}</td>
                <td className="px-3 py-3">{card.kit}</td>
                <td className="px-3 py-3">{card.sl}</td>
                <td className="px-3 py-3">{card.expiry || card.expiryDate}</td>
                <td className="px-3 py-3">{card.amount}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      card.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {card.status}
                  </span>
                </td>
                <td className="px-3 py-3">{card.hq}</td>
                <td className="px-3 py-3">{card.salesTeam}</td>
                <td className="px-3 py-3">{card.drName}</td>
                <td className="px-3 py-3">{card.drPhoneNumber}</td>
                <td className="px-3 py-3">{card.verifyName}</td>
                <td className="px-3 py-3">{card.empName}</td>
                <td className="px-3 py-3">{card.empPhone}</td>
                <td className="px-3 py-3">{card.createdDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-[#1f2937] border-t border-gray-200 dark:border-gray-700 text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </div>
        <div className="space-x-2">
          <button
            onClick={onPrevPage}
            disabled={page === 1}
            className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-[#2a3340] border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2f3c4f] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={onNextPage}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border text-sm font-medium bg-white dark:bg-[#2a3340] border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2f3c4f] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
