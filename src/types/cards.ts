// src/types/cards.ts

export interface Card {
  cardNo: string;
  tin: string;
  serial: string;
  kit: string;
  SL:string;
  expiryDate: string;
  verifyName: string;
  verifyScore: string;
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
  drCode: string;
  empCode: string;
  empName: string;
  amount: string;
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

