"use client";

import React, { useEffect, useState } from "react";
import { FaTable, FaThLarge } from "react-icons/fa";

type Item = {
  item_name: string;
  brand: string;
  whg_composition: string;
  whg_label_claim: string | null;
  price?: {
    MRP?: number;
    PTR?: number;
    PTS?: number;
    validFrom?: string;
    priceList?: string;
  };
};

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const pageSize = 9;

  useEffect(() => {
    fetch("/api/cards/items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(async (data) => {
        const baseItems = data.items || [];
        const itemNames = baseItems.map((item: any) => item.item_name);

        try {
          const res = await fetch("/api/cards/item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemNames }),
          });

          const result = await res.json();
          const priceMap = Object.fromEntries(
            result.prices.map((p: any) => [p.itemName, p])
          );

          const enrichedItems = baseItems.map((item: any) => ({
            ...item,
            price: priceMap[item.item_name] || {},
          }));

          setItems(enrichedItems);
        } catch (err) {
          console.error("❌ Price Fetch Error:", err);
          setItems(baseItems);
        }

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
          {viewMode === "card" ? <><FaTable /> Table View</> : <><FaThLarge /> Card View</>}
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by item name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-blue-600 dark:text-blue-300">Loading items...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Failed to fetch data.</p>}
      {!loading && !error && filteredItems.length === 0 && (
        <p className="text-red-500 dark:text-red-300">No matching items found.</p>
      )}

      {!loading && !error && (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginatedItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 flex flex-col">
                  <div className="flex gap-2 mb-4 p-4">
                    <img src="https://via.placeholder.com/100x100?text=Front" alt="Front" className="w-1/2 h-[180px] object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                    <img src="https://via.placeholder.com/100x100?text=Back" alt="Back" className="w-1/2 h-[180px] object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="px-4 pb-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">{item.item_name}</h2>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-1"><strong>Brand:</strong> {item.brand}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Composition:</strong> {item.whg_composition}</p>

                    {item.price?.MRP && (
                      <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
                        <strong>MRP:</strong> ₹{item.price.MRP} | <strong>PTR:</strong> ₹{item.price.PTR} | <strong>PTS:</strong> ₹{item.price.PTS}
                      </p>
                    )}
                    {item.price?.validFrom && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <strong>Valid From:</strong> {new Date(item.price.validFrom).toLocaleDateString()} | <strong>Price List:</strong> {item.price.priceList}
                      </p>
                    )}

                    <div className="text-sm text-gray-700 dark:text-gray-300 border-t mt-auto pt-2 overflow-auto max-h-[220px]">
                      <strong className="block text-blue-600 dark:text-blue-400 mb-1">Label Claim:</strong>
                      <div className="mb-1 -mt-1">
                        {(item.whg_label_claim?.trim()?.split("\n")[0]) || (
                          <span className="text-gray-500 italic">No label claim info.</span>
                        )}
                      </div>

                      <div className="overflow-x-auto" dangerouslySetInnerHTML={{
                        __html: (() => {
                          const raw = item.whg_label_claim?.trim?.();
                          if (!raw) return "<p class='text-gray-500 italic'>No label claim data available.</p>";
                          const lines = raw.split("\n");
                          const rows = lines.slice(1).map((line) => {
                            const cells = line.replaceAll(/([…\.]{2,})/g, "</td><td class='border px-3 py-1'>");
                            return `<tr><td class="border px-3 py-1">${cells}</td></tr>`;
                          }).join("");

                          return `
                            <table class="w-full border border-collapse text-sm mt-1">
                              <thead class="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th class="border px-3 py-2 text-left">Items</th>
                                  <th class="border px-3 py-2 text-left">Values</th>
                                </tr>
                              </thead>
                              <tbody>${rows}</tbody>
                            </table>
                          `;
                        })()
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left border">Item</th>
                    <th className="px-4 py-2 text-left border">Brand</th>
                    <th className="px-4 py-2 text-left border">MRP</th>
                    <th className="px-4 py-2 text-left border">PTR</th>
                    <th className="px-4 py-2 text-left border">PTS</th>
                    <th className="px-4 py-2 text-left border">Valid From</th>
                    <th className="px-4 py-2 text-left border">Price List</th>
                    <th className="px-4 py-2 text-left border">Label Claim</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
                  {paginatedItems.map((item, index) => {
                    const raw = item.whg_label_claim?.trim?.();
                    const intro = raw?.split("\n")[0] || "<span class='italic text-gray-400'>No label claim</span>";
                    const labelClaimTable = (() => {
                      if (!raw) return "<p class='text-gray-400 italic'>No label claim data available.</p>";
                      const lines = raw.split("\n");
                      const rows = lines.slice(1).map((line) => {
                        const cells = line.replaceAll(/([…\.]{2,})/g, "</td><td class='border px-2 py-1'>");
                        return `<tr><td class='border px-2 py-1'>${cells}</td></tr>`;
                      }).join("");
                      return `
                        <table class='border border-collapse w-full mt-1 text-xs'>
                          <thead class='bg-gray-50 dark:bg-gray-800'>
                            <tr>
                              <th class='border px-2 py-1 text-left'>Items</th>
                              <th class='border px-2 py-1 text-left'>Values</th>
                            </tr>
                          </thead>
                          <tbody>${rows}</tbody>
                        </table>`;
                    })();

                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{item.item_name}</td>
                        <td className="px-4 py-2 border">{item.brand}</td>
                        <td className="px-4 py-2 border">₹{item.price?.MRP ?? "-"}</td>
                        <td className="px-4 py-2 border">₹{item.price?.PTR ?? "-"}</td>
                        <td className="px-4 py-2 border">₹{item.price?.PTS ?? "-"}</td>
                        <td className="px-4 py-2 border">{item.price?.validFrom ? new Date(item.price.validFrom).toLocaleDateString() : "-"}</td>
                        <td className="px-4 py-2 border">{item.price?.priceList ?? "-"}</td>
                        <td className="px-4 py-2 border">
                          <div dangerouslySetInnerHTML={{ __html: intro }} />
                          <div dangerouslySetInnerHTML={{ __html: labelClaimTable }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50">⬅️ Prev</button>
              <span className="font-medium text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50">Next ➡️</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Items;
