import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper: format to "17 Jun 2025 14:50" (IST, 24-hour)
function formatISTTimestamp(dateInput) {
  return new Date(dateInput).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", "");
}

export async function GET() {
  try {
    // 1. Fetch all cards
    const { rows: allCards } = await pool.query(`
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
        "drName",
        "hq",
        "qr",
        "verifyName",
        "verifyScore",
        "designation",
        "empPhone",
        "drPhoneNumber"
      FROM "GiftCardDetails"
      ORDER BY "createdDate" DESC
    `);

    // Optional: Format createdDate if used in frontend
    allCards.forEach(card => {
      if (card.createdDate) {
        card.createdDate = formatISTTimestamp(card.createdDate);
      }
    });

    // Group by status
    const cardsByStatus = {};
    allCards.forEach(card => {
      const rawStatus = card.status || "unknown";
      const status = rawStatus.trim().toLowerCase();
      if (!cardsByStatus[status]) {
        cardsByStatus[status] = [];
      }
      cardsByStatus[status].push(card);
    });

    const totalCards = allCards.length;
    const activeCards = cardsByStatus["active"]?.length || 0;
    const pendingActivation = totalCards - activeCards;
    const salesTeams = new Set(allCards.map(c => c.salesTeam)).size;

    // 2. Fetch latest activities
    const { rows: activityRows } = await pool.query(`
      SELECT "cardNo", "by", "activityType", "comments", "time"
      FROM "GiftCardActivity"
      ORDER BY "time" DESC
    `);

    const activities = activityRows.map((row) => {
      let meta = {};
      try {
        meta = row.comments ? JSON.parse(row.comments) : {};
      } catch {
        meta = {};
      }

      const readableMeta = Object.entries(meta)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' • ');

      return {
        activityType: row.activityType || '',
        cardNo: row.cardNo || '',
        by: row.by || '',
        extraText: readableMeta,
        timestamp: formatISTTimestamp(row.time),
      };
    });

    // 3. Return structured response
    return NextResponse.json({
      totalCards,
      activeCards,
      pendingActivation,
      salesTeams: Array.from(new Set(allCards.map(c => c.salesTeam))),
      activated: cardsByStatus["active"] || [],
      received: cardsByStatus["received"] || [],
      employeescanned: cardsByStatus["employeescanned"] || [],
      formfilled: cardsByStatus["formfilled"] || [],
      drscanned: cardsByStatus["drscanned"] || [],
      inprocess: [
        ...(cardsByStatus["received"] || []),
        ...(cardsByStatus["employeescanned"] || []),
        ...(cardsByStatus["formfilled"] || []),
      ],
      activities,
    });

  } catch (err) {
    console.error('[API][dashboard][ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
