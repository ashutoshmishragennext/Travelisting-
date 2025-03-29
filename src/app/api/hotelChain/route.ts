import { HotelChainTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hotel_chains = await db.select().from(HotelChainTable);
    return NextResponse.json(hotel_chains);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function POST(request: Request) {
  try {

    const data = await request.json();

    if(!data.name){
      return NextResponse.json({
        message:"name are required field" ,
        status:500 
      })
    }

   const new_hotels= await db.insert(HotelChainTable).values(
    {
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
          headquarters: data.headquarters,
          properties: data.properties,
    }
   )
   return NextResponse.json(
    { message: "Hotel chain created successfully", hotelChain: new_hotels }
   )

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
