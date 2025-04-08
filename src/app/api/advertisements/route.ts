
// app/api/vendor/advertisements/route.ts
import { NextRequest, NextResponse } from 'next/server';


import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { AdvertisementTable  } from '@/drizzle/schema';

export async function GET(request: NextRequest) {
  try {
    const vendorId = request.nextUrl.searchParams.get('vendorId');
    
    // if (!vendorId) {
    //   return NextResponse.json(
    //     { success: false, error: 'Vendor ID is required' },
    //     { status: 400 }
    //   );
    // }
    
    let advertisements = await db.select().from(AdvertisementTable)
    // Get all active advertisements for the vendor
    if(vendorId){
     advertisements = await db
      .select()
      .from(AdvertisementTable)
      .where(eq(AdvertisementTable.createdBy, vendorId));
    }
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
    
    const requestData = await request.json();
    // Handle the nested structure from client
    const { advertisementId, updateData } = requestData;
    
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
    
    // Extract the data for updating
    const { title, content, imageUrl, type , redirectUrl } = updateData;
    
    // Update only the advertisement table
    const updatedAd = await db
      .update(AdvertisementTable)
      .set({
        title,
        content,
        imageUrl,
        type,
        redirectUrl,
        updatedAt: new Date()
      })
      .where(eq(AdvertisementTable.id, advertisementId))
      .returning();
    
    if (updatedAd.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update advertisement' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        advertisement: updatedAd[0]
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}