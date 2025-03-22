// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/db/connection';
// import { ServiceTable, ServiceCategoryTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ServiceCategoryTable, ServiceTable } from '@/drizzle/schema';
import { db } from '@/lib/db';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
 
    const baseQuery = db
      .select({
        id: ServiceTable.id,
        name: ServiceTable.name,
        description: ServiceTable.description,
        categoryId: ServiceTable.categoryId,
        image:ServiceTable.image,
        categoryName: ServiceCategoryTable.name,
        requiredCertifications: ServiceTable.requiredCertifications,
        isActive: ServiceTable.isActive
      })
      .from(ServiceTable)
      .leftJoin(ServiceCategoryTable, eq(ServiceTable.categoryId, ServiceCategoryTable.id));
 
    const query = categoryId 
      ? baseQuery.where(eq(ServiceTable.categoryId, categoryId))
      : baseQuery;
 
    const services = await query;
 
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      categoryId, 
      name, 
      image,
      description, 
      requiredCertifications, 
      isActive 
    } = body;

    // Validate required fields
    if (!categoryId || !name) {
      return NextResponse.json(
        { message: 'Category ID and Name are required' }, 
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryCheck = await db
      .select()
      .from(ServiceCategoryTable)
      .where(eq(ServiceCategoryTable.id, categoryId))
      .limit(1);

    if (categoryCheck.length === 0) {
      return NextResponse.json(
        { message: 'Invalid Category ID' }, 
        { status: 404 }
      );
    }

    const newService = await db
      .insert(ServiceTable)
      .values({
        categoryId,
        name,
        image,
        description: description || null,
        requiredCertifications: requiredCertifications || [],
        isActive: isActive ?? true
      })
      .returning();

    return NextResponse.json(newService[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}