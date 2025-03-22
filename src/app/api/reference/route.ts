import { ReferenceTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface ReferenceInput {
  vendorId: string;
  clientCompanyName: string;
  clientIndustry: string;
  projectDescription: string;
  servicePeriodStart: string;
  servicePeriodEnd: string;
  contactPersonName: string;
  contactEmail: string;
  isPublic: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReferenceInput;

    // Validate required fields
    const requiredFields: (keyof ReferenceInput)[] = [
      "vendorId",
      "clientCompanyName",
      "clientIndustry",
      "projectDescription",
      "servicePeriodStart",
      "servicePeriodEnd",
      "contactPersonName",
      "contactEmail",
      "isPublic",
    ];

    const missingFields = requiredFields.filter((field) => !(field in body));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", fields: missingFields },
        { status: 400 }
      );
    }

    // Parse service period dates
    const servicePeriodStart = new Date(body.servicePeriodStart);
    const servicePeriodEnd = new Date(body.servicePeriodEnd);

    if (
      isNaN(servicePeriodStart.getTime()) ||
      isNaN(servicePeriodEnd.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid date format for service period" },
        { status: 400 }
      );
    }


   const newReference = {
     vendorId: body.vendorId,
     clientCompanyName: body.clientCompanyName,
     clientIndustry: body.clientIndustry,
     projectDescription: body.projectDescription, // Optional if nullable in DB
     servicePeriodStart: new Date(body.servicePeriodStart).toISOString(), // Ensure proper date formatting
     servicePeriodEnd: new Date(body.servicePeriodEnd).toISOString(), // Ensure proper date formatting
     contactPersonName: body.contactPersonName,
     contactEmail: body.contactEmail,
     isPublic: body.isPublic,
   } satisfies typeof ReferenceTable.$inferInsert;


    // Insert the new reference into the database
  const reference = await db
    .insert(ReferenceTable)
    .values(newReference)
    .returning();

    return NextResponse.json(reference[0]);
  } catch (error: any) {
    console.error("Error creating reference:", error);

    return NextResponse.json(
      {
        error: "Error creating reference",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
