// src/app/api/service-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/db/connection'; // Adjust connection import
// import { ServiceCategoryTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { ServiceCategoryTable } from '@/drizzle/schema';

// GET all service categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.select().from(ServiceCategoryTable);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST create a new service category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name,logo, description, isActive } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' }, 
        { status: 400 }
      );
    }

    const newCategory = await db
      .insert(ServiceCategoryTable)
      .values({
        name,
        logo,
        description: description || null,
        isActive: isActive ?? true
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service category:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// GET a specific service category by ID
