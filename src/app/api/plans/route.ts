// src/app/api/plans/route.ts
import { PlanTable } from "@/drizzle/schema";
import { db } from "@/lib/db";

import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET all plans
export async function GET() {
  try {
    const plans = await db.query.PlanTable.findMany({
      orderBy: (plans, { desc }) => [desc(plans.createdAt)],
    });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST new plan
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, validityYears, commission, features } = body;

    // Validate required fields
    if (!name || !price || !validityYears || !commission) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new plan
    const newPlan = await db.insert(PlanTable).values({
      name,
      description,
      price,
      validityYears,
      commission,
      features: features || {},
      isActive: true,
    }).returning();

    return NextResponse.json(newPlan[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}

// src/app/api/plans/[id]/route.ts


export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedPlan = await db
      .delete(PlanTable)
      .where(eq(PlanTable.id, params.id))
      .returning();

    if (!deletedPlan.length) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedPlan[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}