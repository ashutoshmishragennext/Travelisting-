// File: app/api/advertisements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { AdvertisementTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { AdvertisementTable } from "@/drizzle/schema";


// Validation schema for creating an advertisement
const createAdvertisementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["BANNER", "POPUP", "SIDEBAR", "FEATURED_DEAL", "EMAIL", "NOTIFICATION"]),
  content: z.record(z.any()),
  imageUrl: z.string().optional(),
  redirectUrl: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().default(true),
  targetAudience: z.record(z.any()).optional(),
  createdBy: z.string(),
});

// GET /api/advertisements
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    
    // Build query conditions
    let query = db.select().from(AdvertisementTable);
    
    if (type) {
      query = query.where(eq(AdvertisementTable.type, type));
    }
    
    if (isActive !== null) {
      query = query.where(eq(AdvertisementTable.isActive, isActive === "true"));
    }
    
    const advertisements = await query;
    
    return NextResponse.json(advertisements);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return NextResponse.json(
      { error: "Failed to fetch advertisements" },
      { status: 500 }
    );
  }
}

// POST /api/advertisements
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and permissions
  
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createAdvertisementSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Insert advertisement into database
    const newAdvertisement = await db.insert(AdvertisementTable).values({
      title: data.title,
      type: data.type,
      content: data.content,
      imageUrl: data.imageUrl,
      redirectUrl: data.redirectUrl,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
      targetAudience: data.targetAudience || {},
      metrics: { impressions: 0, clicks: 0 },
      createdBy: data.createdBy,
    }).returning();
    
    return NextResponse.json(newAdvertisement[0], { status: 201 });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return NextResponse.json(
      { error: "Failed to create advertisement" },
      { status: 500 }
    );
  }
}