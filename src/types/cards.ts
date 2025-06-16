// src/types/cards.ts

export interface Card {
  cardNo: string;
  tin: string;
  serial: string;
  kit: string;
  sl:string;
  expiryDate: string;
  amount: string;
  status: string;
  salesTeam: string;
  createdDate: string;
  hq: string;
  qr: string;
}

export interface ToBeActivatedCard extends Card {
  drName: string;
  drPhoneNumber: string;
  empName: string;
  designation: string;
  verifyName: string;
  verifyScore: string;
  empPhone: string;
}

export interface DetailedCard extends ToBeActivatedCard {} // alias for reuse

export interface Activity {
  activityType: string;
  cardNo: string;
  by: string;
  timestamp: string;
  message: string;
}

export interface DashboardSummary {
  totalCards: number;
  activeCards: number;
  pendingActivation: number;
  salesTeams: string[];
  activated: DetailedCard[];
  received: DetailedCard[];
  employeescanned: DetailedCard[];
  formfilled: DetailedCard[];
  drscanned: DetailedCard[];
  inprocess: DetailedCard[];
  activities: Activity[];
}

