"use client";

import React, { useEffect, useState } from "react";
import { FaTable, FaThLarge } from "react-icons/fa";

type Item = {
  item_name: string;
  brand: string;
  whg_composition: string;
  whg_label_claim: string;
};

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const pageSize = 9;

  useEffect(() => {
    fetch("/api/cards/items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const brands = [...new Set(items.map((item) => item.brand).filter(Boolean))];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedBrands]);

  const filteredItems = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedBrands.length === 0 || selectedBrands.includes(item.brand))
  );

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">
          🧾 ERPNext Product Items
        </h1>
        <button
          onClick={() =>
            setViewMode((prev) => (prev === "card" ? "table" : "card"))
          }
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {viewMode === "card" ? (
            <>
              <FaTable /> Table View
            </>
          ) : (
            <>
              <FaThLarge /> Card View
            </>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by item name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filter Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-800 dark:text-blue-300 rounded-md"
        >
          {showFilters ? "🔽 Hide Filters" : "🔼 Filter by Brand"}
        </button>
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-3">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full shadow-sm border transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <span className="text-white text-xs bg-blue-400 w-4 h-4 flex items-center justify-center rounded-full">
                      ✓
                    </span>
                  )}
                  {brand}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading/Error States */}
      {loading && <p className="text-blue-600 dark:text-blue-300">Loading items...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Failed to fetch data.</p>}
      {!loading && !error && filteredItems.length === 0 && (
        <p className="text-red-500 dark:text-red-300">No matching items found.</p>
      )}

      {/* View Modes */}
      {!loading && !error && (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginatedItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="flex gap-2 mb-4 p-4">
                    <img
                      src="https://via.placeholder.com/100x100?text=Front"
                      alt="Front"
                      className="w-1/2 h-[180px] object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                    <img
                      src="https://via.placeholder.com/100x100?text=Back"
                      alt="Back"
                      className="w-1/2 h-[180px] object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="px-4 pb-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">{item.item_name}</h2>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                      <strong>Brand:</strong> {item.brand}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <strong>Composition:</strong> {item.whg_composition}
                    </p>
                    <div className="text-sm text-gray-700 dark:text-gray-300 border-t mt-auto pt-2 whitespace-pre-line overflow-auto max-h-[150px]">
                      <strong>Label Claim:</strong> {item.whg_label_claim || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
              <table className="w-full min-w-[800px] table-fixed text-left border-collapse rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 sticky top-0 z-10">
                  <tr className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600">Item Name</th>
                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600">Brand</th>
                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600">Composition</th>
                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600">Label Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`text-sm transition-colors duration-150 ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800"
                      } hover:bg-blue-50 dark:hover:bg-gray-700`}
                    >
                      <td className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">
                        {item.item_name}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 font-semibold">
                        {item.brand}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300">
                        {item.whg_composition}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 whitespace-pre-line">
                        {item.whg_label_claim || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
              >
                ⬅️ Prev
              </button>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Items;
