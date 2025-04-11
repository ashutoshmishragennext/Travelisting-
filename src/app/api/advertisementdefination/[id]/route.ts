// app/api/advertisementdefination/[id]/route.ts
import { AdvertisementDefinitionTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const deletedAdvertisement = await db
      .delete(AdvertisementDefinitionTable)
      .where(eq(AdvertisementDefinitionTable.id, id))
      .returning();

    if (deletedAdvertisement.length === 0) {
      return NextResponse.json(
        { message: "Advertisement type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Advertisement type deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete advertisement type:", error);
    return NextResponse.json(
      { message: "Failed to delete advertisement type", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, description, price, width, height,timePeriod } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name field is required." },
        { status: 400 }
      );
    }

    const updatedAdvertisement = await db
      .update(AdvertisementDefinitionTable)
      .set({
        name,
        description,
        price,
        width,
        height,
        timePeriod,
        updatedAt: new Date(),
      })
      .where(eq(AdvertisementDefinitionTable.id, id))
      .returning();

    if (updatedAdvertisement.length === 0) {
      return NextResponse.json(
        { message: "Advertisement type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAdvertisement[0], { status: 200 });
  } catch (error) {
    console.error("Failed to update advertisement type:", error);
    return NextResponse.json(
      { message: "Failed to update advertisement type", error },
      { status: 500 }
    );
  }
}