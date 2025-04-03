// // src/app/api/properties/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { PropertyTable } from "@/drizzle/schema";
// import { eq, and, like } from "drizzle-orm";

// interface PropertyInput {
//   name: string;
//   propertyType: "HOTEL" | "RESORT" | "HOMESTAY" | "VILLA" | "HOSTEL";
//   category?: string;
//   subcategory?: string;
//   starRating?: number;
//   chainId?: string;
  
//   address?: string;
//   state?: string;
//   city?: string;
//   pincode?: string;
  
//   contactName?: string;
//   contactEmail?: string;
//   contactPhone?: string;
  
//   amenities?: string[];
//   photos?: string[];
  
//   isActive?: boolean;
// }

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as PropertyInput;

//     // Validate required fields
//     const requiredFields = ["name", "propertyType"];
//     const missingFields = requiredFields.filter((field) => !(field in body));

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: "Missing required fields", fields: missingFields },
//         { status: 400 }
//       );
//     }

//     // Prepare property data
//     const newProperty = {
//       name: body.name,
//       propertyType: body.propertyType,
//       category: body.category,
//       subcategory: body.subcategory,
//       starRating: body.starRating,
//       chainId: body.chainId,
      
//       address: body.address,
//       state: body.state,
//       city: body.city,
//       pincode: body.pincode,
      
//       contactName: body.contactName,
//       contactEmail: body.contactEmail,
//       contactPhone: body.contactPhone,
      
//       amenities: body.amenities,
//       photos: body.photos,
      
//       isActive: body.isActive ?? true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     } satisfies typeof PropertyTable.$inferInsert;

//     // Insert the property
//     const property = await db.insert(PropertyTable)
//       .values(newProperty)
//       .returning();

//     return NextResponse.json(property[0], { status: 201 });
//   } catch (error) {
//     console.error("Error creating property:", error);
//     return NextResponse.json(
//       {
//         error: "Error creating property",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
    
//     // Pagination
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const offset = (page - 1) * limit;

//     // Filtering parameters
//     const propertyType = searchParams.get('propertyType');
//     const category = searchParams.get('category');
//     const subcategory = searchParams.get('subcategory');
//     const state = searchParams.get('state');
//     const name = searchParams.get('name');
//     const minStarRating = searchParams.get('minStarRating');

//     // Build query
//     let query = db.select().from(PropertyTable);

//     // Apply filters
//     const whereConditions = [];
//     if (propertyType) whereConditions.push(eq(PropertyTable.propertyType, propertyType));
//     if (category) whereConditions.push(eq(PropertyTable.category, category));
//     if (subcategory) whereConditions.push(eq(PropertyTable.subcategory, subcategory));
//     if (state) whereConditions.push(eq(PropertyTable.state, state));
//     if (name) whereConditions.push(like(PropertyTable.name, `%${name}%`));
//     if (minStarRating) whereConditions.push(eq(PropertyTable.starRating, parseInt(minStarRating)));

//     // Add where clause if conditions exist
//     if (whereConditions.length > 0) {
//       query = query.where(and(...whereConditions));
//     }

//     // Add pagination
//     query = query.limit(limit).offset(offset);

//     // Execute query
//     const properties = await query;

//     // Get total count
//     const [{ count }] = await db
//       .select({ count: PropertyTable.id.count() })
//       .from(PropertyTable);

//     return NextResponse.json({
//       properties,
//       pagination: {
//         total: count,
//         page,
//         limit,
//         totalPages: Math.ceil(count / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     return NextResponse.json(
//       {
//         error: "Error fetching properties",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }


// // export async  function GET(){
// //   return new Response("Hello World", { status: 200 });
// // }