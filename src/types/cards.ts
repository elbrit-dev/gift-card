// src/types/cards.ts

export interface Card {
  cardNo: string;
  tin: string;
  serial: string;
  expiryDate: string;
  amount: string;
  status: string;
  salesTeam: string;
  createdDate: string;
  hq: string;
}

export interface ToBeActivatedCard extends Card {
  drName: string;
  drPhoneNumber: string;
  empName: string;
  designation: string;
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

