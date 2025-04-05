
// app/api/vendor/advertisements/route.ts
import { NextRequest, NextResponse } from 'next/server';


import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { VendorAdvertisementPurchaseTable } from '@/drizzle/schema';

export async function GET(request: NextRequest) {
  try {
    const vendorId = request.nextUrl.searchParams.get('vendorId');
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }
    
    // Get all active advertisements for the vendor
    const advertisements = await db
      .select()
      .from(VendorAdvertisementPurchaseTable)
      .where(eq(VendorAdvertisementPurchaseTable.vendorId, vendorId))
      .orderBy(VendorAdvertisementPurchaseTable.createdAt);
    
    return NextResponse.json({
      success: true,
      data: advertisements
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching vendor advertisements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendor advertisements' },
      { status: 500 }
    );
  }
}
