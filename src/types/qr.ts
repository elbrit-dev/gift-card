// types/qr.ts

/**
 * Basic structure for QR data entry
 * - Used for manual input or shared across types
 */
export type QRRow = {
  cardNo: string;
  tin: string;
  serial: string;
  expiry: string;
};

/**
 * A row that has been uploaded but not yet activated
 * - Used in Pending QR Table
 */
export type PendingQRRow = QRRow & {
  status: "Pending" | "UnderVerification" | string;
  source: "Upload" | "Manual" | string;
};

/**
 * A QR row that has already been generated and saved
 * - Used in Generated QR Table
 */
export type GeneratedQRRow = PendingQRRow & {
  generatedDate: string; // ISO date format
  qr: string;            // URL or encoded string
};
