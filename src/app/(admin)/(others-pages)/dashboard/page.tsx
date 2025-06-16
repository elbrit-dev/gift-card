"use client";
import React, { useEffect, useState } from "react";

import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import ActivatedCardsTable from "@/components/dashboard/ActivatedCardsTable";
import PendingCardsTable from "@/components/dashboard/PendingCardsTable";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import ToBeActivatedCardsTable from "@/components/dashboard/ToBeActivatedCardsTable";

import { Card, ToBeActivatedCard, DetailedCard, Activity } from "@/types/cards";
import { DashboardSummary } from "@/types/cards";


// --- DashboardSummary Type ---
// interface DashboardSummary {
//   totalCards: number;
//   activeCards: number;
//   pendingActivation: number;
//   salesTeams: string[];
//   tobeactivated: ToBeActivatedCard[];
//   activated: DetailedCard[]; // ✅ FIXED HERE
//   inprocess: DetailedCard[]; // ✅ FIXED HERE
//   activities: Activity[];
// }


export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cards/dashboard")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((json) => {
        setSummary(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!summary) {
    return <div className="p-10 text-center text-gray-400">No data available.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div>
        <h2 className="text-lg font-bold mb-1 text-gray-800 dark:text-white">Dashboard</h2>
        <div className="text-sm text-gray-500 mb-6">
          Overview of card activations and sales team performance
        </div>
      </div>

      <DashboardSummaryCards
        totalCards={summary.totalCards}
        salesTeams={summary.salesTeams.length}
        cardsByStatus={{
          active: summary.activated,
          received: summary.received,
          employeescanned: summary.employeescanned,
          formfilled: summary.formfilled,
          drscanned: summary.drscanned,
        }}
      />


      <ToBeActivatedCardsTable cards={summary.drscanned} />
      <ActivatedCardsTable cards={summary.activated || []} />
      <PendingCardsTable cards={summary.inprocess} />
      <RecentActivityFeed activities={summary.activities} />
    </div>
  );
}
