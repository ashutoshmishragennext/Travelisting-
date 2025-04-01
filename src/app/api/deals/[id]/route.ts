// app/api/deals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { DealTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DealTable } from "@/drizzle/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await db
      .select()
      .from(DealTable)
      .where(eq(DealTable.id, params.id))
      .execute();
    
    if (!deal.length) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ deal: deal[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}