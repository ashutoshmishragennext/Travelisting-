// app/api/deals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import { eq } from "drizzle-orm";
import { DealTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const dealType = searchParams.get("dealType");
    const travelType = searchParams.get("travelType");
    
    let query = db.select().from(DealTable);
    
    // Apply filters if they exist
    if (dealType) {
      query = query.where(eq(DealTable.dealType, dealType));
    }
    
    if (travelType) {
      query = query.where(eq(DealTable.travelType, travelType));
    }
    
    const deals = await query.execute();
    
    return NextResponse.json({ deals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.dealType || !body.travelType || !body.travelAgentId || !body.validFrom || !body.validTo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Insert new deal
    const newDeal = await db.insert(DealTable).values({
      
      dealType: body.dealType,
      travelType: body.travelType,
      travelAgentId: body.travelAgentId,
      propertyId: body.propertyId,
      description: body.description,
      price: body.price,
      discount: body.discount,
      images: body.images,
      contactPhones: body.contactPhones,
      contactEmails: body.contactEmails,
      dealTypeDefinitionId: body.dealTypeDefinitionId,
      metadata: body.metadata,
      flightDetails: body.flightDetails,
      hotelDetails: body.hotelDetails,
      formattedContent: body.formattedContent,
      country: body.country,
      state: body.state,
      city: body.city,
      validFrom: new Date(body.validFrom),
      validTo: new Date(body.validTo),
      isActive: body.isActive ?? true,
      isPromoted: body.isPromoted ?? false,
    }).returning();
    
    return NextResponse.json({ deal: newDeal[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}








