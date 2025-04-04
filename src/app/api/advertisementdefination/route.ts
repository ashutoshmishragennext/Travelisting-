import { AdvertisementDefinitionTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const advertisements = await db.select().from(AdvertisementDefinitionTable);
    return NextResponse.json(advertisements, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch advertisements", error: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    // Optional: Basic validation
    if (!name || !description || !image) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const newAdvertisement = await db
      .insert(AdvertisementDefinitionTable)
      .values({
        name,
        description,
        image,
      })
      .returning();

    return NextResponse.json(newAdvertisement[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create advertisement", error: error },
      { status: 500 }
    );
  }
}
