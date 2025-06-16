"use client";
import React from "react";

// Match the Card type used in page.tsx
interface Card {
  cardNo: string;
  tin: string;
  serial: string;
  expiry: string;
  amount: string;
  status: string;
  createdDate: string;
  salesTeam: string;
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
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161D29] mt-4 overflow-hidden shadow-sm">
      <table className="w-full border-collapse text-black dark:text-white">
        <thead>
          <tr className="bg-[#f9fafb] dark:bg-[#202838] border-t border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">
              <input
                type="checkbox"
                checked={
                  cards.length > 0 &&
                  cards.every((card) => selectedCardNos.has(card.cardNo))
                }
                onChange={() => onRowSelect("all")}
              />
            </th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">GIFT CARD NUMBER</th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">TIN</th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">SERIAL</th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">EXPIRY</th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">AMOUNT</th>
            <th className="text-left px-3 py-2 border-r border-gray-200 dark:border-gray-700 font-semibold text-xs tracking-wide">STATUS</th>
            <th className="text-left px-3 py-2 font-semibold text-xs tracking-wide">SALES TEAM</th>
          </tr>
        </thead>
        <tbody>
          {cards.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-5 text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-700">
                No cards found
              </td>
            </tr>
          )}
          {cards.map((card) => (
            <tr
              key={card.cardNo}
              className={`hover:bg-gray-50 dark:hover:bg-[#232e42] border-b border-gray-200 dark:border-gray-700 transition`}
            >
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={selectedCardNos.has(card.cardNo)}
                  onChange={() => onRowSelect(card.cardNo)}
                />
              </td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">{card.cardNo}</td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">{card.tin}</td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">{card.serial}</td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">{card.expiry}</td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">{card.amount}</td>
              <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    card.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {card.status}
                </span>
              </td>
              <td className="px-3 py-2">{card.salesTeam}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-end p-2 space-x-2 border-t border-gray-200 dark:border-gray-700 bg-[#f9fafb] dark:bg-[#202838]">
        <button
          disabled={page === 1}
          onClick={onPrevPage}
          className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-[#212A3A] text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#232e42] transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs font-medium text-gray-800 dark:text-gray-100">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={onNextPage}
          className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-[#212A3A] text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#232e42] transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
