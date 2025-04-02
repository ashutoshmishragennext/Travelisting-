// app/api/deal-type-metadata/route.ts


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { DealTypeMetadataTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const dealTypeId = searchParams.get("dealTypeId");

    const conditions = [];

    // Apply filter if it exists
    if (dealTypeId) {
      conditions.push(eq(DealTypeMetadataTable.dealTypeId, dealTypeId));
    }

    // Fetch data using conditions
    const metadata = await db
      .select()
      .from(DealTypeMetadataTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute();

    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deal type metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal type metadata" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.dealTypeId || !body.schema || !body.createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Insert new deal type metadata
    const newMetadata = await db.insert(DealTypeMetadataTable).values({
      dealTypeId: body.dealTypeId,
      schema: body.schema,
      isActive: body.isActive ?? true,
      createdBy: body.createdBy,
    }).returning();
    
    return NextResponse.json({ metadata: newMetadata[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating deal type metadata:", error);
    return NextResponse.json(
      { error: "Failed to create deal type metadata" },
      { status: 500 }
    );
  }
}