// import { PlanTable } from "@/drizzle/schema";
// import { db } from "@/lib/db";

// import { eq } from "drizzle-orm";
// import { NextRequest, NextResponse } from "next/server";
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const { name, description, price, validityYears, commission, features, isActive } = body;

//     const updatedPlan = await db
//       .update(PlanTable)
//       .set({
//         name,
//         description,
//         price,
//         validityYears,
//         commission,
//         features,
//         isActive,
//         updatedAt: new Date(),
//       })
//       .where(eq(PlanTable.id, params.id))
//       .returning();

//     if (!updatedPlan.length) {
//       return NextResponse.json(
//         { error: "Plan not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedPlan[0]);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update plan" },
//       { status: 500 }
//     );
//   }
// }



export async  function GET(){
  return new Response("Hello World", { status: 200 });
}