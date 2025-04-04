// app/api/deals/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { and, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { DealTable, DealTypeDefinitionTable, DealTypeMetadataTable } from "@/drizzle/schema";

// Define search query parameters interface
interface SearchParams {
  dealTypeId?: string;
  title?: string;
  travelType?: string;
  country?: string;
  state?: string;
  city?: string;
  validFrom?: string;
  validTo?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  metadata?: Record<string, any>; // Dynamic metadata search parameters
}

export async function POST(request: NextRequest) {
  try {
    const searchParams: SearchParams = await request.json();
    
    // Start building the base query
    let query = db.select().from(DealTable);
    
    // Build the where conditions
    const whereConditions = [];
    
    // Add basic field filters
    if (searchParams.dealTypeId) {
      whereConditions.push(eq(DealTable.dealTypeDefinitionId, searchParams.dealTypeId));
    }
    
    if (searchParams.title) {
      whereConditions.push(ilike(DealTable.title, `%${searchParams.title}%`));
    }
    
    if (searchParams.travelType) {
      whereConditions.push(eq(DealTable.travelType, searchParams.travelType));
    }
    
    if (searchParams.country) {
      whereConditions.push(ilike(DealTable.country, `%${searchParams.country}%`));
    }
    
    if (searchParams.state) {
      whereConditions.push(ilike(DealTable.state, `%${searchParams.state}%`));
    }
    
    if (searchParams.city) {
      whereConditions.push(ilike(DealTable.city, `%${searchParams.city}%`));
    }
    
    if (searchParams.validFrom) {
      whereConditions.push(sql`${DealTable.validFrom} >= ${searchParams.validFrom}`);
    }
    
    if (searchParams.validTo) {
      whereConditions.push(sql`${DealTable.validTo} <= ${searchParams.validTo}`);
    }
    
    if (searchParams.minPrice !== undefined) {
      whereConditions.push(sql`${DealTable.price} >= ${searchParams.minPrice}`);
    }
    
    if (searchParams.maxPrice !== undefined) {
      whereConditions.push(sql`${DealTable.price} <= ${searchParams.maxPrice}`);
    }
    
    if (searchParams.isActive !== undefined) {
      whereConditions.push(eq(DealTable.isActive, searchParams.isActive));
    }
    
    // Handle dynamic metadata search
    if (searchParams.metadata && Object.keys(searchParams.metadata).length > 0) {
      // For each metadata field, create a JSON path condition
      Object.entries(searchParams.metadata).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Text/string search with ilike for partial matches
          whereConditions.push(
            sql`${DealTable.metadata}->>${key} ILIKE ${`%${value}%`}`
          );
        } else if (typeof value === 'number') {
          // Exact match for numbers
          whereConditions.push(
            sql`${DealTable.metadata}->>${key} = ${String(value)}`
          );
        } else if (typeof value === 'boolean') {
          // Boolean comparison
          whereConditions.push(
            sql`${DealTable.metadata}->>${key} = ${String(value)}`
          );
        } else if (Array.isArray(value)) {
          // Array contains any of the items
          whereConditions.push(
            sql`${DealTable.metadata}->${key} ?| ${JSON.stringify(value)}`
          );
        } else if (value !== null && typeof value === 'object') {
          // Range search for objects with min/max properties
          if ('min' in value && value.min !== undefined) {
            whereConditions.push(
              sql`(${DealTable.metadata}->>${key})::numeric >= ${value.min}`
            );
          }
          if ('max' in value && value.max !== undefined) {
            whereConditions.push(
              sql`(${DealTable.metadata}->>${key})::numeric <= ${value.max}`
            );
          }
        }
      });
    }
    
    // Apply all conditions with AND
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    // Execute the query
    const deals = await query.execute();
    
    return NextResponse.json({ success: true, deals });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search deals" },
      { status: 500 }
    );
  }
}

// GET endpoint that retrieves the metadata schema for a specific deal type
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dealTypeId = searchParams.get('dealTypeId');
    
    if (!dealTypeId) {
      return NextResponse.json(
        { success: false, error: "dealTypeId is required" },
        { status: 400 }
      );
    }
    
    // Get the deal type and its metadata schema
    const dealType = await db.select()
      .from(DealTypeDefinitionTable)
      .where(eq(DealTypeDefinitionTable.id, dealTypeId))
      .execute();
      
    if (dealType.length === 0) {
      return NextResponse.json(
        { success: false, error: "Deal type not found" },
        { status: 404 }
      );
    }
    
    const metadataSchema = await db.select()
      .from(DealTypeMetadataTable)
      .where(and(
        eq(DealTypeMetadataTable.dealTypeId, dealTypeId),
        eq(DealTypeMetadataTable.isActive, true)
      ))
      .execute();
      
    if (metadataSchema.length === 0) {
      return NextResponse.json(
        { success: false, error: "Metadata schema not found" },
        { status: 404 }
      );
    }
    
    // Get example deals for this deal type (limit to 5)
    const exampleDeals = await db.select({
      id: DealTable.id,
      title: DealTable.title,
      metadata: DealTable.metadata
    })
      .from(DealTable)
      .where(eq(DealTable.dealTypeDefinitionId, dealTypeId))
      .limit(5)
      .execute();
      
    return NextResponse.json({
      success: true,
      schema: {
        ...metadataSchema[0],
        dealTypeName: dealType[0].name,
        dealTypeDescription: dealType[0].description
      },
      exampleDeals
    });
  } catch (error) {
    console.error("Error getting schema:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get schema" },
      { status: 500 }
    );
  }
}