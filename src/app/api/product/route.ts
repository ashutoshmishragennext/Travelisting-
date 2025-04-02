// // src/app/api/products/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { eq } from 'drizzle-orm';
// import { ProductCategoryTable, ProductTable } from '@/drizzle/schema';
// import { db } from '@/lib/db';

// // GET all products
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const categoryId = searchParams.get('id');
    
//     const baseQuery = db
//       .select({
//         id: ProductTable.id,
//         name: ProductTable.name,
//         image:ProductTable.image,
//         description: ProductTable.description,
//         categoryId: ProductTable.categoryId,
//         categoryName: ProductCategoryTable.name,
//         requiredCertifications: ProductTable.requiredCertifications,
//         isActive: ProductTable.isActive
//       })
//       .from(ProductTable)
//       .leftJoin(ProductCategoryTable, eq(ProductTable.categoryId, ProductCategoryTable.id));
    
//     const query = categoryId 
//       ? baseQuery.where(eq(ProductTable.categoryId, categoryId))
//       : baseQuery;
    
//     const products = await query;
    
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' }, 
//       { status: 500 }
//     );
//   }
// }

// // POST create a new product
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { 
//       categoryId, 
//       name, 
//       description, 
//       image,
//       requiredCertifications, 
//       isActive 
//     } = body;

//     // Validate required fields
//     if (!categoryId || !name) {
//       return NextResponse.json(
//         { message: 'Category ID and Name are required' }, 
//         { status: 400 }
//       );
//     }

//     // Verify category exists
//     const categoryCheck = await db
//       .select()
//       .from(ProductCategoryTable)
//       .where(eq(ProductCategoryTable.id, categoryId))
//       .limit(1);

//     if (categoryCheck.length === 0) {
//       return NextResponse.json(
//         { message: 'Invalid Category ID' }, 
//         { status: 404 }
//       );
//     }

//     const newProduct = await db
//       .insert(ProductTable)
//       .values({
//         categoryId,
//         name,
//         image: image || null,
//         description: description || null,
//         requiredCertifications: requiredCertifications || [],
//         isActive: isActive ?? true
//       })
//       .returning();

//     return NextResponse.json(newProduct[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' }, 
//       { status: 500 }
//     );
//   }
// }


export async  function GET(){
  return new Response("Hello World", { status: 200 });
}