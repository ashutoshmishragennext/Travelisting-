import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { DealTypeMetadataTable, DealTypeDefinitionTable } from "@/schemas";
import { and, eq, ilike, sql } from "drizzle-orm";
import { DealTypeDefinitionTable, DealTypeMetadataTable } from "@/drizzle/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchQuery, fieldPath, dealTypeId } = body;

    if (!searchQuery || !fieldPath) {
      return NextResponse.json(
        { error: "Search query and field path are required" },
        { status: 400 }
      );
    }

    // Base query
    let query = db.select({
      id: DealTypeMetadataTable.id,
      dealTypeId: DealTypeMetadataTable.dealTypeId,
      schema: DealTypeMetadataTable.schema,
      isActive: DealTypeMetadataTable.isActive,
      createdAt: DealTypeMetadataTable.createdAt,
      dealTypeName: DealTypeDefinitionTable.name,
    })
    .from(DealTypeMetadataTable)
    .leftJoin(
      DealTypeDefinitionTable,
      eq(DealTypeMetadataTable.dealTypeId, DealTypeDefinitionTable.id)
    );

    // Add conditions
    const conditions = [];

    // If dealTypeId is provided, filter by it
    if (dealTypeId) {
      conditions.push(eq(DealTypeMetadataTable.dealTypeId, dealTypeId));
    }

    // Add JSONB search condition
    // Format: schema->fieldPath->>key ILIKE %searchQuery%
    // The field path should be in format 'key1.key2.key3' for nested objects
    const pathParts = fieldPath.split('.');
    let jsonPathExpression;

    if (pathParts.length === 1) {
      // Direct key in schema object
      jsonPathExpression = sql`${DealTypeMetadataTable.schema}->>${fieldPath}`;
    } else {
      // Nested key, construct proper JSON path
      const lastKey = pathParts.pop();
      const jsonPath = pathParts.join('.');
      jsonPathExpression = sql`${DealTypeMetadataTable.schema}->${jsonPath}->>${lastKey}`;
    }

    conditions.push(sql`${jsonPathExpression} ILIKE ${`%${searchQuery}%`}`);

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Execute the query
    const results = await query;

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      data: results 
    });
  } catch (error) {
    console.error("Error searching deal type metadata:", error);
    return NextResponse.json(
      { error: "Failed to search deal type metadata" },
      { status: 500 }
    );
  }
}

// Advanced version with more search capabilities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dealTypeId = searchParams.get("dealTypeId");
    const isActive = searchParams.get("isActive");
    
    // JSON search params
    const field = searchParams.get("field");
    const value = searchParams.get("value");
    const operator = searchParams.get("operator") || "contains"; // Default to contains
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Base query
    let query = db.select({
      id: DealTypeMetadataTable.id,
      dealTypeId: DealTypeMetadataTable.dealTypeId,
      schema: DealTypeMetadataTable.schema,
      isActive: DealTypeMetadataTable.isActive,
      createdAt: DealTypeMetadataTable.createdAt,
      updatedAt: DealTypeMetadataTable.updatedAt,
      dealTypeName: DealTypeDefinitionTable.name,
    })
    .from(DealTypeMetadataTable)
    .leftJoin(
      DealTypeDefinitionTable,
      eq(DealTypeMetadataTable.dealTypeId, DealTypeDefinitionTable.id)
    );

    // Add conditions
    const conditions = [];

    // Filter by dealTypeId if provided
    if (dealTypeId) {
      conditions.push(eq(DealTypeMetadataTable.dealTypeId, dealTypeId));
    }

    // Filter by isActive if provided
    if (isActive !== null && isActive !== undefined) {
      conditions.push(eq(DealTypeMetadataTable.isActive, isActive === "true"));
    }

    // Add JSON field search if both field and value are provided
    if (field && value) {
      const pathParts = field.split('.');
      let jsonCondition;

      if (pathParts.length === 1) {
        // Direct key in schema object
        const jsonField = sql`${DealTypeMetadataTable.schema}->>${field}`;
        
        switch (operator) {
          case "equals":
            jsonCondition = sql`${jsonField} = ${value}`;
            break;
          case "contains":
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}%`}`;
            break;
          case "startsWith":
            jsonCondition = sql`${jsonField} ILIKE ${`${value}%`}`;
            break;
          case "endsWith":
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}`}`;
            break;
          case "greaterThan":
            jsonCondition = sql`CAST(${jsonField} AS NUMERIC) > ${parseFloat(value)}`;
            break;
          case "lessThan":
            jsonCondition = sql`CAST(${jsonField} AS NUMERIC) < ${parseFloat(value)}`;
            break;
          default:
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}%`}`;
        }
      } else {
        // Nested key, construct proper JSON path
        const lastKey = pathParts.pop();
        const jsonPath = pathParts.join('.');
        const jsonField = sql`${DealTypeMetadataTable.schema}->${jsonPath}->>${lastKey}`;
        
        switch (operator) {
          case "equals":
            jsonCondition = sql`${jsonField} = ${value}`;
            break;
          case "contains":
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}%`}`;
            break;
          case "startsWith":
            jsonCondition = sql`${jsonField} ILIKE ${`${value}%`}`;
            break;
          case "endsWith":
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}`}`;
            break;
          case "greaterThan":
            jsonCondition = sql`CAST(${jsonField} AS NUMERIC) > ${parseFloat(value)}`;
            break;
          case "lessThan":
            jsonCondition = sql`CAST(${jsonField} AS NUMERIC) < ${parseFloat(value)}`;
            break;
          default:
            jsonCondition = sql`${jsonField} ILIKE ${`%${value}%`}`;
        }
      }
      
      conditions.push(jsonCondition);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Add pagination
    query = query.limit(limit).offset(offset);

    // Execute the query
    const results = await query;

    // Get total count for pagination
    const countQuery = db.select({ count: sql`COUNT(*)` })
      .from(DealTypeMetadataTable);
    
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    
    const [countResult] = await countQuery;
    const totalCount = Number(countResult?.count || 0);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit, 
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error searching deal type metadata:", error);
    return NextResponse.json(
      { error: "Failed to search deal type metadata" },
      { status: 500 }
    );
  }
}