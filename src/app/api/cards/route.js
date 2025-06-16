import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

// GET: Fetch cards from GiftCardDetails
// GET: Fetch cards with status "tobeactivated" from GiftCardDetails
export async function GET() {
  try {
    const query = `
      SELECT 
        "salesTeam", 
        "cardNo",
        "kit", 
        "SL", 
        "status", 
        "expiryDate", 
        "createdDate",
        "employeeCode",
        "drCode",
        "empName",
        "verifyName",
        "drName",
        "hq",
        "designation",
        "empPhone",
        "drPhoneNumber"
      FROM "GiftCardDetails"
      WHERE "status" = 'drscanned'
      ORDER BY "createdDate" DESC
    `;
    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[API][GiftCardDetails][GET][ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// POST: Insert/Upsert card into GiftCardDetails
export async function POST(req) {
  try {
    const { cardNo, kit, SL, expiry, qr } = await req.json();
    if (!cardNo || !kit || !SL || !expiry || !qr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = `
      INSERT INTO "GiftCardDetails" 
        ("cardNo", "kit", "SL", "expiryDate", "qr", "status", "createdDate")
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
      ON CONFLICT ("cardNo") DO UPDATE SET
        "kit" = EXCLUDED."kit",
        "SL" = EXCLUDED."SL",
        "expiryDate" = EXCLUDED."expiryDate",
        "qr" = EXCLUDED."qr",
        "status" = EXCLUDED."status",
        "createdDate" = CURRENT_DATE
      RETURNING *;
    `;
    const values = [cardNo, kit, SL, expiry, qr, "drscanned"];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, card: result.rows[0] });
  } catch (err) {
    console.error('[API][GiftCardDetails][POST][ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
