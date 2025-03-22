// app/api/vendors/[vendorId]/route.ts
import { NextResponse } from 'next/server';
import * as vendorQueries from '@/utils/vendor';



export async function GET(request: Request) {
    try {
      // Get vendorId from searchParams instead of params
      const { searchParams } = new URL(request.url);
      const vendorId = searchParams.get('vendorId');
  
      if (!vendorId) {
        return NextResponse.json(
          { error: 'Vendor ID is required' },
          { status: 400 }
        );
      }
  
      const vendor = await vendorQueries.getVendorProfile(vendorId);
      return NextResponse.json(vendor);
      // ... rest of your code
    } catch (error) {
        console.error('Error in vendor API route:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
    }
  }


// export async function PATCH(
//   request: Request,
//   { params }: { params: { vendorId: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const vendorId = params.vendorId;
//     const data = await request.json();

//     const updatedVendor = await vendorQueries.updateVendorProfile(vendorId, data);

//     return NextResponse.json(updatedVendor);
//   } catch (error) {
//     console.error('Error updating vendor:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/vendors/[vendorId]/products/route.ts
// export async function GET(
//   request: Request,
//   { params }: { params: { vendorId: string } }
// ) {
//   try {
//     const vendorId = params.vendorId;
//     const products = await vendorQueries.getVendorProducts(vendorId);

//     return NextResponse.json(products);
//   } catch (error) {
//     console.error('Error fetching vendor products:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(
//   request: Request,
//   { params }: { params: { vendorId: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const vendorId = params.vendorId;
//     const data = await request.json();

//     const product = await vendorQueries.addVendorProduct({
//       ...data,
//       vendorId
//     });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error('Error adding vendor product:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }