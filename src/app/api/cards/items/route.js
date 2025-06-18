import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.ERP_API_KEY;
    const apiSecret = process.env.ERP_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("Missing ERP API credentials in .env");
    }

    const url = `https://erp.elbrit.org/api/resource/Item?limit_page_length=100000&filters=[["item_group","=","Products"]]&fields=["item_name","brand","whg_composition","whg_label_claim"]`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!Array.isArray(data.data)) {
      throw new Error("Unexpected ERP response: " + JSON.stringify(data));
    }

    return NextResponse.json({ items: data.data });
  } catch (error) {
    console.error("❌ ERP fetch error:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
