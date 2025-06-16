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

    if (!Array.isArray(cardNos) || cardNos.length === 0) {
      return NextResponse.json({ error: "No card numbers provided" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE "GiftCardDetails"
       SET "status" = 'active'
       WHERE "cardNo" = ANY($1::text[])`,
      [cardNos]
    );

    return NextResponse.json({ success: true, updated: result.rowCount });
  } catch (err) {
    console.error("❌ DB Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
