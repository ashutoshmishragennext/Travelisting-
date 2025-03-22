// src/app/api/product-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { ProductCategoryTable } from '@/drizzle/schema';

// GET all product categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.select().from(ProductCategoryTable);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST create a new product category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description,logo, isActive } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' }, 
        { status: 400 }
      );
    }

    const newCategory = await db
      .insert(ProductCategoryTable)
      .values({
        name,
        logo : logo || null,
        description: description || null,
        isActive: isActive ?? true
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product category:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}