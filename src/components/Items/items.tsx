"use client";

import React, { useEffect, useState } from "react";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6">
        ERPNext Product Items
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by item name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filter Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-800 dark:text-blue-300 rounded-md"
        >
          {showFilters ? "Hide Filters" : "Filter by Brand"}
        </button>

        {/* Chip-style Brand Filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-3">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full shadow-sm border
                    transition-all duration-200 ease-in-out
                    ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                    }
                  `}
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

      {/* Loading/Error/No results */}
      {loading && <p className="text-blue-600 dark:text-blue-300">Loading items...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Something went wrong while fetching data.</p>}
      {!loading && !error && filteredItems.length === 0 && (
        <p className="text-red-500 dark:text-red-300">No matching items found.</p>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {paginatedItems.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="flex gap-2 mb-4">
              <img
                src="https://via.placeholder.com/100x100?text=Front"
                alt="Product Front"
                className="w-1/2 h-[200px] object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <img
                src="https://via.placeholder.com/100x100?text=Back"
                alt="Product Back"
                className="w-1/2 h-[200px] object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Product Info */}
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">
              {item.item_name}
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">
              <strong>Brand:</strong> {item.brand}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              <strong>Composition:</strong> {item.whg_composition}
            </p>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line overflow-auto max-h-[200px] border-t border-gray-200 dark:border-gray-700 pt-2 mt-auto">
              <strong>Label Claim:</strong>{" "}
              {item.whg_label_claim || "N/A"}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default Items;
