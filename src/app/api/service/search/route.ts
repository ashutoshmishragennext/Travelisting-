import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ServiceTable, ServiceCategoryTable } from '@/drizzle/schema';
import { and, eq, ilike } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

// Type for count query result
type CountResult = {
  count: number | string;
}

export async function GET(request: NextRequest) {
  try {
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('term') || '';
    
    // Split search term into words
    const searchWords = searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    // Default pagination
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = searchWords.length > 0
      ? and(...searchWords.map(word => ilike(ServiceTable.name, `%${word}%`)))
      : undefined;

    // Main query for services
    const services = await db
      .select({
        id: ServiceTable.id,
        name: ServiceTable.name,
        description: ServiceTable.description,
        image: ServiceTable.image,
        requiredCertifications: ServiceTable.requiredCertifications,
        isActive: ServiceTable.isActive,
        categoryId: ServiceTable.categoryId,
        categoryName: ServiceCategoryTable.name,
        categoryLogo: ServiceCategoryTable.logo,
      })
      .from(ServiceTable)
      .leftJoin(
        ServiceCategoryTable, 
        eq(ServiceTable.categoryId, ServiceCategoryTable.id)
      )
      .where(whereConditions)
      .orderBy(desc(ServiceTable.name))
      .limit(limit)
      .offset(offset);

    // Count query
    // const countResult = await db
    //   .select({
    //     count: db.fn.count<number>(ServiceTable.id).as('count'),
    //   })
      // .from(ServiceTable)
      // .where(whereConditions) as CountResult[];

    // Safely get the count
    // const totalCount = Number(countResult[0]?.count || 0);
    // const totalPages = Math.ceil(totalCount / limit);

    // Return response
    return NextResponse.json({
      services,
      pagination: {
        currentPage: page,
        // totalPages,
        // totalCount,
        // hasMore: page < totalPages,
      },
    });

  } catch (error) {
    console.error('Service search error:', error);
    return NextResponse.json(
      { error: 'Failed to search services' },
      { status: 500 }
    );
  }
}