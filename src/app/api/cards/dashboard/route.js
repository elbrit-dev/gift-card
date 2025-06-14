import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    // 1. Fetch all cards from GiftCardDetails with extra details
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

    // Categorize cards
    const activated = allCards.filter(c => c.status === "active");
    const tobeactivated = allCards.filter(c => c.status === "tobeactivated");
    const inprocess = allCards.filter(
      c => c.status !== "active" && c.status !== "tobeactivated"
    );

    const totalCards = allCards.length;
    const activeCards = activated.length;
    const pendingActivation = allCards.filter(c => c.status !== "active").length;
    const salesTeams = new Set(allCards.map(c => c.salesTeam)).size;

    // 2. Fetch latest 5 activities from GiftCardActivity
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

    // 3. Return full dashboard payload
    return NextResponse.json({
      totalCards,
      activeCards,
      pendingActivation,
      salesTeams,
      activated,
      tobeactivated,
      inprocess,
      activities,
    });
  } catch (err) {
    console.error('[API][dashboard][ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
