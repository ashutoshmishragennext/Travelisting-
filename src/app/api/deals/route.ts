// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// import { eq, and, desc } from "drizzle-orm";
// import { DealTable } from "@/drizzle/schema";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const dealTypeDefinitionId = searchParams.get("dealType");
//     const travelType = searchParams.get("travelType");
//     const city = searchParams.get("city");
//     const country = searchParams.get("country");
//     const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
//     const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined;
    
//     // Build query with filters
//     let query = db.select().from(DealTable);
    
//     // Apply filters conditionally
//     const conditions = [];
    
//     if (dealTypeDefinitionId) {
//       conditions.push(eq(DealTable.dealTypeDefinitionId, dealTypeDefinitionId));
//     }
    
//     if (travelType) {
//       conditions.push(eq(DealTable.travelType, travelType));
//     }
    
//     if (city) {
//       conditions.push(eq(DealTable.city, city));
//     }
    
//     if (country) {
//       conditions.push(eq(DealTable.country, country));
//     }
    
//     if (isActive !== undefined) {
//       conditions.push(eq(DealTable.isActive, isActive));
//     }
    
//     // Apply all conditions if they exist
//     if (conditions.length > 0) {
//       query = query.where(and(...conditions));
//     }
    
//     // Sort by newest first
//     query = query.orderBy(desc(DealTable.createdAt));
    
//     // Apply limit if specified
//     if (limit) {
//       query = query.limit(limit);
//     }
//     if (country) conditions.push(eq(DealTable.country, country));
//     if (state) conditions.push(eq(DealTable.state, state));
//     if (city) conditions.push(eq(DealTable.city, city));

//     // Fetch data with conditions
//     const deals = await db
//       .select()
//       .from(DealTable)
//       .where(conditions.length > 0 ? and(...conditions) : undefined)
//       .execute();

//     return NextResponse.json({ deals }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching deals:", error);
//     return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     if (!body.title || !body.travelType || !body.travelAgentId || !body.validFrom || !body.validTo) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Create the deal insertion object exactly matching the schema
//     const dealData = {
//       title: body.title,
//       dealType: body.dealType,
//       travelType: body.travelType,
//       travelAgentId: body.travelAgentId,
//       propertyId: body.propertyId || null,
//       description: body.description || null,
//       price: body.price || null,
//       discount: body.discount || null,
//       images: body.images || null,
//       contactPhones: body.contactPhones || null,
//       contactEmails: body.contactEmails || null,
//       dealTypeDefinitionId: body.dealTypeDefinitionId || null,
//       metadata: body.metadata || null,
//       flightDetails: body.flightDetails || null,
//       hotelDetails: body.hotelDetails || null,
//       formattedContent: body.formattedContent || null,
//       country: body.country || null,
//       state: body.state || null,
//       city: body.city || null,
//       validFrom: new Date(body.validFrom),
//       validTo: new Date(body.validTo),
//       isActive: body.isActive !== undefined ? body.isActive : true,
//       isPromoted: body.isPromoted !== undefined ? body.isPromoted : false,
//     };
    
//     // Insert new deal
//     const newDeal = await db.insert(DealTable).values(dealData).returning();
    
//     return NextResponse.json({ deal: newDeal[0] }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating deal:", error);
//     return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
//   }
// }


export async  function GET(){
  return new Response("Hello World", { status: 200 });
}