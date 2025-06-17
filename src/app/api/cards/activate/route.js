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
    const mode = body?.mode || "activate";

    console.log("📥 Incoming request body:", body);
    console.log("📌 Mode:", mode);
    console.log("📦 Card Numbers:", cardNos);

    if (!Array.isArray(cardNos) || cardNos.length === 0) {
      console.error("❌ No valid card numbers provided");
      return NextResponse.json({ error: "No card numbers provided" }, { status: 400 });
    }

    if (mode === "activate") {
      const webhookUrl = "https://elbrit-dev.app.n8n.cloud/webhook/b60a258f-0271-444c-9c13-e3fce58f11f7";
      const payload = { data: cardNos.map(String) };

      console.log("📤 Sending POST to Webhook:", webhookUrl);
      console.log("📨 Payload:", payload);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const webhookResult = await response.json();

      console.log("✅ Webhook Response:", webhookResult);

      if (!response.ok) {
        throw new Error(webhookResult?.error || "Webhook call failed");
      }

      return NextResponse.json({ success: true, webhookResponse: webhookResult });
    }

    if (mode === "reset") {
      console.log("🔄 Performing reset operation for:", cardNos);

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

      console.log("✅ Reset completed. Rows affected:", result.rowCount);

      return NextResponse.json({ success: true, reset: result.rowCount });
    }

    console.error("❌ Invalid mode provided");
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("❌ Operation Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
