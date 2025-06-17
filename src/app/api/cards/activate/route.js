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
      // Send to webhook instead of DB update
      const webhookUrl = "https://elbrit-dev.app.n8n.cloud/webhook/b60a258f-0271-444c-9c13-e3fce58f11f7";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNos }),
      });

      const webhookResult = await response.json();

      if (!response.ok) {
        throw new Error(webhookResult?.error || "Webhook call failed");
      }

      return NextResponse.json({ success: true, webhookResponse: webhookResult });
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
           "amount" = NULL,
           "drCheckIn" = FALSE,
           "status" = 'received'
         WHERE "cardNo" = ANY($1::text[])`,
        [cardNos]
      );

      return NextResponse.json({ success: true, reset: result.rowCount });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("❌ Operation Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
