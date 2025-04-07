
// app/api/vendor/advertisements/route.ts
import { NextRequest, NextResponse } from 'next/server';


import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { AdvertisementTable, VendorAdvertisementPurchaseTable } from '@/drizzle/schema';

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
      .from(AdvertisementTable)
      .where(eq(AdvertisementTable.createdBy, vendorId));
      // .orderBy(AdvertisementTable.createdAt);
    
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

export async function PUT(request: NextRequest) {
  try {
    const vendorId = request.nextUrl.searchParams.get('vendorId');
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { advertisementId, ...updateData } = data;
    
    if (!advertisementId) {
      return NextResponse.json(
        { success: false, error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the advertisement belongs to this vendor
    const existingAd = await db
      .select()
      .from(AdvertisementTable)
      .where(eq(AdvertisementTable.id, advertisementId))
      .limit(1);
    
    if (existingAd.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    if (existingAd[0].createdBy !== vendorId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Advertisement does not belong to this vendor' },
        { status: 403 }
      );
    }
    
    // Update the advertisement
    const updatedAd = await db
      .update(AdvertisementTable)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(AdvertisementTable.id, advertisementId))
      .returning();
    
    return NextResponse.json({
      success: true,
      data: updatedAd[0]
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating vendor advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update vendor advertisement' },
      { status: 500 }
    );
  }
}