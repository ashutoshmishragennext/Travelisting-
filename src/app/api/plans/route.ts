
// app/api/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { PlanTable } from '@/drizzle/schema';

export async function GET(request: NextRequest) {
  try {
    // Get all advertisement plans
    const plans = await db.select().from(PlanTable).where(eq(PlanTable.isActive, true));
    
    return NextResponse.json({ success: true, data: plans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}





