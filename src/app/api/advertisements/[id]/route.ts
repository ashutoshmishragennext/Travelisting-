// app/api/vendor/advertisements/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { VendorAdvertisementPurchaseTable } from '@/drizzle/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get specific advertisement
    const [advertisement] = await db
      .select()
      .from(VendorAdvertisementPurchaseTable)
      .where(eq(VendorAdvertisementPurchaseTable.id, id));
    
    if (!advertisement) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: advertisement
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching advertisement details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch advertisement details' },
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
    const { adContent } = body;
    
    if (!adContent) {
      return NextResponse.json(
        { success: false, error: 'Advertisement content is required' },
        { status: 400 }
      );
    }
    
    // Update advertisement content
    const [updated] = await db
      .update(VendorAdvertisementPurchaseTable)
      .set({
        adContent,
        updatedAt: new Date()
      })
      .where(eq(VendorAdvertisementPurchaseTable.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Advertisement updated successfully',
      data: updated
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}