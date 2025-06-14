import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    // 1. Fetch all cards
    const { rows: allCards } = await pool.query(`
      SELECT 
        "salesTeam", 
        "cardNo", 
        "status", 
        "expiryDate", 
        "createdDate",
        "employeeCode",
        "drCode",
        "empName",
        "drName",
        "hq",
        "designation",
        "empPhone",
        "drPhoneNumber"
      FROM "GiftCardDetails"
      ORDER BY "createdDate" DESC
    `);

    // Get distinct cards per status
    const cardsByStatus = {};
    allCards.forEach(card => {
      const status = card.status || "unknown";
      if (!cardsByStatus[status]) {
        cardsByStatus[status] = [];
      }
      cardsByStatus[status].push(card);
    });

    // Summary
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

    const activities = activityRows.map(row => {
      let meta = {};
      try {
        meta = row.comments ? JSON.parse(row.comments) : {};
      } catch {
        meta = {};
      }

      const readableMeta = [
        meta.empName ? `Name: ${meta.empName}` : '',
        meta.empPhone ? `Phone: ${meta.empPhone}` : '',
        meta.salesTeam ? `Team: ${meta.salesTeam}` : '',
        meta.hq ? `HQ: ${meta.hq}` : ''
      ].filter(Boolean).join(' • ');

      return {
        activityType: row.activityType || '',
        cardNo: row.cardNo || '',
        by: row.by || '',
        extraText: readableMeta,
        timestamp: row.time ? new Date(row.time).toISOString() : "",
      };
    });

    // 3. Return structured response
    return NextResponse.json({
      totalCards,
      activeCards,
      pendingActivation,
      salesTeams,
      cardsByStatus,
      activities,
    });
  } catch (err) {
    console.error('[API][dashboard][ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
