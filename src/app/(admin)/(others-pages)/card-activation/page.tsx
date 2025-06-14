"use client";
import React, { useState, useEffect, useMemo } from "react";
import BulkControlsSection from "@/components/card-activation/BulkControlsSection";
import GiftCardsTable from "@/components/card-activation/GiftCardsTable";
import BulkActionsFooter from "@/components/card-activation/BulkActionsFooter";

// --- Constants ---
const PAGE_SIZE = 5;

// --- Types ---
type GiftCard = {
  cardNo: string;
  tin: string;
  serial: string;
  expiry: string;
  amount: number;
  status: string;
  createdDate: string;
  salesTeam: string;
};

// --- Main Page ---
export default function CardActivationPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [selectedCardNos, setSelectedCardNos] = useState<Set<string>>(new Set());
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/cards")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cards");
        return res.json();
      })
      .then((data: GiftCard[]) => {
        setCards(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading cards");
        setLoading(false);
      });
  }, []);

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) return cards;
    const term = searchTerm.toLowerCase();
    return cards.filter(
      (c) =>
        c.cardNo?.toLowerCase().includes(term) ||
        c.tin?.toLowerCase().includes(term) ||
        c.serial?.toLowerCase().includes(term) ||
        c.salesTeam?.toLowerCase().includes(term) ||
        c.status?.toLowerCase().includes(term)
    );
  }, [cards, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const pagedCards = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCards.slice(start, start + PAGE_SIZE);
  }, [filteredCards, page]);

  const handleRowSelect = (cardNoOrAll: string) => {
    if (cardNoOrAll === "all") {
      const allFilteredCardNos = filteredCards.map((c) => c.cardNo);
      const isAllSelected = allFilteredCardNos.every((n) => selectedCardNos.has(n));
      const updated = new Set(selectedCardNos);
      if (isAllSelected) {
        allFilteredCardNos.forEach((n) => updated.delete(n));
      } else {
        allFilteredCardNos.forEach((n) => updated.add(n));
      }
      setSelectedCardNos(updated);
    } else {
      const updated = new Set(selectedCardNos);
      if (updated.has(cardNoOrAll)) updated.delete(cardNoOrAll);
      else updated.add(cardNoOrAll);
      setSelectedCardNos(updated);
    }
  };

  const allSelected =
    pagedCards.length > 0 &&
    pagedCards.every((card) => selectedCardNos.has(card.cardNo));

  const handleBulkSelect = () => {
    if (!bulkInput.trim()) return;
    const bulkCardNos = bulkInput
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const matching = cards.filter((c) => bulkCardNos.includes(c.cardNo));
    const updated = new Set(selectedCardNos);
    matching.forEach((c) => updated.add(c.cardNo));
    setSelectedCardNos(updated);
    setBulkInput("");
  };

  const handleSearch = () => setPage(1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleActivate = async () => {
    if (selectedCardNos.size === 0) return;
    setIsActivating(true);
    const cardNosArray = Array.from(selectedCardNos);
    try {
      const response = await fetch("/api/cards/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNos: cardNosArray }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to activate cards");

      const refreshed = await fetch("/api/cards").then((res) => res.json());
      setCards(refreshed || []);
      setSelectedCardNos(new Set());
    } catch (error: any) {
      alert(error.message || "Error activating cards");
    } finally {
      setIsActivating(false);
    }
  };

  const handleExport = () => {
    const selected = cards.filter((c) => selectedCardNos.has(c.cardNo));
    if (selected.length === 0) return alert("No cards selected to export!");
    const csv = [
      [
        "Card Number",
        "TIN",
        "Serial",
        "Expiry",
        "Amount",
        "Status",
        "Created Date",
        "Sales Team",
      ].join(","),
      ...selected.map((c) =>
        [
          c.cardNo,
          c.tin,
          c.serial,
          c.expiry,
          c.amount,
          c.status,
          c.createdDate,
          c.salesTeam,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-gift-cards.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Card Activation</h2>
      <p className="text-gray-600 mb-6 dark:text-gray-320">
        Select and activate cards in bulk from the database
      </p>
      <BulkControlsSection
        allSelected={allSelected}
        selectedCount={selectedCardNos.size}
        onSelectAll={() => handleRowSelect("all")}
        bulkInput={bulkInput}
        setBulkInput={setBulkInput}
        onBulkSelect={handleBulkSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <GiftCardsTable
          cards={pagedCards}
          selectedCardNos={selectedCardNos}
          onRowSelect={handleRowSelect}
          page={page}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
      <BulkActionsFooter
        selectedCount={selectedCardNos.size}
        onExport={handleExport}
        onActivate={handleActivate}
        isActivating={isActivating}
      />
    </div>
  );
}
