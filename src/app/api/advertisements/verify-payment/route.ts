import { AdvertisementTable } from '@/drizzle/schema';
import { db } from '@/lib/db';

import { NextResponse } from 'next/server';

// Define allowed ad types for validation
const allowedTypes = [
  'BANNER',
  'POPUP',
  'SIDEBAR',
  'FEATURED_DEAL',
  'EMAIL',
  'NOTIFICATION',
] as const;

type AdTypeLiteral = typeof allowedTypes[number];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, adTypes, id } = body;

    if (!userId || !adTypes || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (Array.isArray(adTypes) && adTypes.length > 0) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // 30-day duration

      const adEntries = adTypes.map((type: any) => {
        const validType = allowedTypes.includes(type.type) ? (type.type as AdTypeLiteral) : 'BANNER';

        return {
          userId,
          createdBy: userId,
          paymentId: id,
          AdvertisementTypeId: type.id || type,
          content: type.content || '',
          status: 'ACTIVE',
          startDate,
          endDate,
          type: validType, // ✅ must be one of the allowed enum values
        };
      });

      await db.insert(AdvertisementTable).values(adEntries);
    }

    return NextResponse.json({ message: 'Advertisement(s) created successfully' });
  } catch (error) {
    console.error('Error inserting advertisement:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
