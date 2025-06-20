// app/api/cards/item/route.js

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const itemNames = body.itemNames;

    if (!Array.isArray(itemNames) || itemNames.length === 0) {
      return new Response(
        JSON.stringify({ error: "itemNames must be a non-empty array" }),
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        "itemName", 
        "MRP", 
        "PTR", 
        "PTS", 
        "validFrom", 
        "priceList"
      FROM product
      WHERE "itemName" = ANY($1)
    `;

    const result = await pool.query(query, [itemNames]);

    return new Response(JSON.stringify({ prices: result.rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
