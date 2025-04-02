import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { DealTable } from "@/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealTypeDefinitionId = searchParams.get("dealType");
    const travelType = searchParams.get("travelType");
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const state = searchParams.get("state");

    // Build conditions dynamically
    const conditions = [];
    if (dealTypeDefinitionId) conditions.push(eq(DealTable.dealTypeDefinitionId, dealTypeDefinitionId));
    if (travelType && (travelType === "DOMESTIC" || travelType === "INTERNATIONAL")) {
      conditions.push(eq(DealTable.travelType, travelType));
    }
    if (country) conditions.push(eq(DealTable.country, country));
    if (state) conditions.push(eq(DealTable.state, state));
    if (city) conditions.push(eq(DealTable.city, city));

    // Fetch data with conditions
    const deals = await db
      .select()
      .from(DealTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .execute();

    return NextResponse.json({ deals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.travelType || !body.travelAgentId || !body.validFrom || !body.validTo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDeal = await db.insert(DealTable).values({
      title: body.title,
      travelType: body.travelType,
      travelAgentId: body.travelAgentId,
      propertyId: body.propertyId || null,
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
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
