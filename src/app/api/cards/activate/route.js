import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const cardNos = body?.cardNos;
    const mode = body?.mode || "activate"; // default to activate

    if (!Array.isArray(cardNos) || cardNos.length === 0) {
      return NextResponse.json({ error: "No card numbers provided" }, { status: 400 });
    }

    if (mode === "activate") {
      const result = await pool.query(
        `UPDATE "GiftCardDetails"
         SET "status" = 'active'
         WHERE "cardNo" = ANY($1::text[])`,
        [cardNos]
      );

      return NextResponse.json({ success: true, updated: result.rowCount });
    }

    if (mode === "reset") {
      const result = await pool.query(
        `UPDATE "GiftCardDetails"
         SET
           "drName" = NULL,
           "drPhoneNumber" = NULL,
           "empName" = NULL,
           "empPhone" = NULL,
           "designation" = NULL,
           "employeeCode" = NULL,
           "drCode" = NULL,
           "verifyName" = NULL,
           "verifyScore" = NULL,
           "hq" = NULL,
           "salesTeam" = NULL,
           "createdDate" = NULL,
           "amount" = NULL,
           "qr" = NULL,
           "drCheckIn" = FALSE,
           "status" = 'received'
         WHERE "cardNo" = ANY($1::text[])`,
        [cardNos]
      );

      return NextResponse.json({ success: true, reset: result.rowCount });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("❌ DB Operation Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
