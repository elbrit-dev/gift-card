import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper: Return timestamp with +05:30 offset
function getISTTimestamp() {
  const now = new Date();
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + offsetMs);
  return istTime.toISOString().replace("Z", "+05:30");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const cardNos = body?.cardNos;
    const mode = body?.mode || "activate";
    const userEmail = body?.email;
    const userName = body?.name || "Unknown";

    if (!Array.isArray(cardNos) || cardNos.length === 0) {
      return NextResponse.json({ error: "No card numbers provided" }, { status: 400 });
    }

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    if (mode === "reset") {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const resetResult = await client.query(
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

        const now = getISTTimestamp();

        for (const cardNo of cardNos) {
          await client.query(
            `INSERT INTO "GiftCardActivity" ("ID", "cardNo", "by", "time", "activityType", "comments")
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              now,
              cardNo,
              userEmail,
              now,
              "Card Reset",
              JSON.stringify({ userName }),
            ]
          );
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, reset: resetResult.rowCount });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
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

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("❌ DB Operation Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
