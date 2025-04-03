// app/api/deals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

import { eq } from 'drizzle-orm';
import { DealTable } from '@/drizzle/schema';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If id is provided, fetch specific deal
    if (id) {
      const deal = await db.query.DealTable.findFirst({
        where: eq(DealTable.id, id),
      });

      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }

      return NextResponse.json(deal);
    } 
    
    // Otherwise fetch all deals
    const deals = await db.select().from(DealTable);
    return NextResponse.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if ( !body.travelAgentId  || !body.validTo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert new deal
    const newDeal = await db.insert(DealTable).values({
      title: body.title,
      travelType: body.travelType,
      travelAgentId: body.travelAgentId,
      description: body.description,
      price: body.price,
      discount: body.discount,
      images: body.images,
      contactPhones: body.contactPhones,
      contactEmails: body.contactEmails,
      dealTypeDefinitionId: body.dealTypeDefinitionId,
      metadata: body.metadata,
      flightDetails: body.flightDetails,
      hotelDetails: body.hotelDetails,
      formattedContent: body.formattedContent,
      country: body.country,
      state: body.state,
      city: body.city,
      validFrom: body.validFrom,
      validTo: body.validTo,
      isActive: body.isActive ?? true,
      isPromoted: body.isPromoted ?? false,
      propertyId: body.propertyId,
    }).returning();

    return NextResponse.json(newDeal[0], { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}