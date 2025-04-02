// app/api/deal-types/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { DealTypeDefinitionTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { DealTypeDefinitionTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    const dealTypes = await db
      .select()
      .from(DealTypeDefinitionTable)
      
    
    return NextResponse.json({ dealTypes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deal types:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Insert new deal type
    const newDealType = await db.insert(DealTypeDefinitionTable).values({
      name: body.name,
      description: body.description,
      isActive: body.isActive ?? true,
      createdBy: body.createdBy,
    }).returning();
    
    return NextResponse.json({ dealType: newDealType[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating deal type:", error);
    return NextResponse.json(
      { error: "Failed to create deal type" },
      { status: 500 }
    );
  }
}