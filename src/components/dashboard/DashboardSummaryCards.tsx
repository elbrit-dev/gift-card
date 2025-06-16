"use client";
import React from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  FileClock,
  AlertCircle,
} from "lucide-react";

interface GiftCard {
  cardNo: string;
  status: string;
  createdDate?: string;
  [key: string]: any;
}

interface DashboardSummaryCardsProps {
  totalCards: number;
  salesTeams: number;
  cardsByStatus?: Record<string, GiftCard[]>;
}

const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  totalCards,
  salesTeams,
  cardsByStatus = {},
}) => {
  const getCount = (status: string) => cardsByStatus[status]?.length || 0;

  const cards = [
    {
      label: "Total Cards",
      value: totalCards,
      icon: <CreditCard size={28} className="text-blue-600" />,
      border: "border-blue-100",
    },
    {
      label: "To be scanned",
      value: getCount("received"),
      icon: <CreditCard size={28} className="text-blue-500" />,
      border: "border-blue-200",
    },
    {
      label: "Step-1: Employee scan",
      value: getCount("employeescanned"),
      icon: <FileClock size={28} className="text-gray-500" />,
      border: "border-gray-100",
    },
    {
      label: "Form filled, Doctor Scan Pending",
      value: getCount("formfilled"),
      icon: <Clock size={28} className="text-yellow-600" />,
      border: "border-yellow-100",
    },
    {
      label: "Step-2: Doctor Scanned",
      value: getCount("drscanned"),
      icon: <AlertCircle size={28} className="text-orange-500" />,
      border: "border-orange-200",
    },
    {
      label: "Active",
      value: getCount("active"),
      icon: <CheckCircle size={28} className="text-green-600" />,
      border: "border-green-100",
    }
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {cards.map((item, index) => (
        <div
          key={index}
          className={`flex items-center bg-white dark:bg-gray-900 border ${item.border} rounded-2xl shadow-md px-6 py-5 min-h-[92px] transition hover:shadow-lg`}
        >
          <div className="mr-4 flex-shrink-0">{item.icon}</div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{item.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300 font-medium mt-0.5">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
