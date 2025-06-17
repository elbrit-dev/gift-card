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
      const baseUrl = "https://elbrit-dev.app.n8n.cloud/webhook/b60a258f-0271-444c-9c13-e3fce58f11f7";

      const query = new URLSearchParams();
      cardNos.forEach((card, i) => query.append(`data[${i}]`, String(card)));

      const webhookUrl = `${baseUrl}?${query.toString()}`;

      console.log("📤 Sending GET to Webhook:", webhookUrl);

      const response = await fetch(webhookUrl, {
        method: "GET",
      });

      const resultText = await response.text();
      console.log("✅ Webhook Response Text:", resultText);

      if (!response.ok) {
        throw new Error(`Webhook call failed: ${resultText}`);
      }

      return NextResponse.json({ success: true, webhookResponse: resultText });
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
