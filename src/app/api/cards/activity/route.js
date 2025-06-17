import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper to get IST timestamp in required format
function getISTTimestamp() {
  const now = new Date();
  const offsetMs = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + offsetMs);
  return istTime.toISOString().replace("Z", "+05:30");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { cardNos, user } = body;

    if (!Array.isArray(cardNos) || cardNos.length === 0) {
      return NextResponse.json({ error: "No card numbers provided" }, { status: 400 });
    }

    if (!user?.email || !user?.name) {
      return NextResponse.json({ error: "User info missing" }, { status: 400 });
    }

    const now = getISTTimestamp();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const cardNo of cardNos) {
        await client.query(
          `INSERT INTO "GiftCardActivity" ("ID", "cardNo", "by", "time", "activityType", "comments")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            now, // ID and time
            cardNo,
            user.email,
            now,
            "Card Reset",
            JSON.stringify({ userName: user.name }),
          ]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true, count: cardNos.length });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Activity Logging Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
