"use client";
import React from "react";
import { Users, CreditCard, Loader, Briefcase } from "lucide-react";

interface DashboardSummaryCardsProps {
  totalCards: number;
  activeCards: number;
  pendingActivation: number;
  salesTeams: number;
}

const CARD_CONFIG = [
  {
    label: "Total Cards",
    icon: <CreditCard size={28} className="text-blue-600" />,
    key: "totalCards",
    border: "border-blue-100",
  },
  {
    label: "Active Cards",
    icon: <Users size={28} className="text-green-600" />,
    key: "activeCards",
    border: "border-green-100",
  },
  {
    label: "Pending Activation",
    icon: <Loader size={28} className="text-yellow-500" />,
    key: "pendingActivation",
    border: "border-yellow-100",
  },
  {
    label: "Sales Teams",
    icon: <Briefcase size={28} className="text-indigo-500" />,
    key: "salesTeams",
    border: "border-indigo-100",
  },
];

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  totalCards,
  activeCards,
  pendingActivation,
  salesTeams,
}) => {
  const data = { totalCards, activeCards, pendingActivation, salesTeams };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {CARD_CONFIG.map((item) => (
        <div
          key={item.key}
          className={`flex items-center bg-white dark:bg-gray-900 border ${item.border} rounded-2xl shadow-md px-6 py-5 min-h-[92px] transition hover:shadow-lg`}
        >
          <div className="mr-4 flex-shrink-0">{item.icon}</div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{data[item.key]}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300 font-medium mt-0.5">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
