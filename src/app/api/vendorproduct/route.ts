import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProductTable, VendorProductTable, VendorProfileTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const vendorProductId = searchParams.get('vendorProductId');
    const productId = searchParams.get('productId');

    if (!vendorId && !vendorProductId && !productId) {
      return NextResponse.json(
        { error: 'Either Vendor ID, Product ID or Vendor Product ID is required' },
        { status: 400 }
      );
    }

    // New condition to handle productId
    if (productId) {
      const productData = await db.query.VendorProductTable.findMany({
        where: eq(VendorProductTable.productId, productId),
        with: {
          product: {
            with: {
              category: true
            }
          },
          vendor: {
            with: {
              user: true
            }
          }
        }
      });

      if (!productData || productData.length === 0) {
        return NextResponse.json(
          { error: 'No product found with this ID' },
          { status: 404 }
        );
      }

      const transformedProductData = productData.map(vp => ({
        product: {
          id: vp.product.id,
          name: vp.product.name,
          description: vp.product.description,
          categoryName: vp.product.category?.name,
          requiredCertifications: vp.product.requiredCertifications,
          isActive: vp.product.isActive
        },
        vendorProductDetails: {
          id: vp.id,
          experienceYears: vp.experienceYears,
          pricingModel: vp.pricingModel,
          photo: vp.photo,
          description: vp.description,
          specifications: vp.specifications,
          stock: vp.stock,
          price: vp.price ,
          currency: vp.currency,
          isActive: vp.isActive
        },
        vendor: {
          id: vp.vendor.id,
          companyName: vp.vendor.companyName,
          primaryContactName: vp.vendor.primaryContactName,
          primaryContactEmail: vp.vendor.primaryContactEmail,
          primaryContactPhone: vp.vendor.primaryContactPhone,
          headquartersAddress: vp.vendor.headquartersAddress,
          pincode: vp.vendor.pincode,
          whatsappnumber: vp.vendor.whatsappnumber,
          businessOpeningDays: vp.vendor.businessOpeningDays,
          state: vp.vendor.state,
          city: vp.vendor.city,
          logo: vp.vendor.logo
        }
      }));

      return NextResponse.json({
        success: true,
        products: transformedProductData
      });
    }

    if (vendorId) {
      // Fetch vendor products for a specific vendor
      const vendorProductData = await db.query.VendorProductTable.findMany({
        where: eq(VendorProductTable.vendorId, vendorId),
        with: {
          product: {
            with: {
              category: true
            }
          },
          vendor: true
        }
      });

      if (!vendorProductData || vendorProductData.length === 0) {
        return NextResponse.json(
          { error: 'No products found for this vendor' },
          { status: 404 }
        );
      }

      const transformedVendorProductData = vendorProductData.map(vp => ({
        product: {
          id: vp.product.id,
          name: vp.product.name,
          description: vp.product.description,
          categoryName: vp.product.category?.name,
          requiredCertifications: vp.product.requiredCertifications,
          isActive: vp.product.isActive
        },
        vendorProductDetails: {
          id: vp.id,
          experienceYears: vp.experienceYears,
          pricingModel: vp.pricingModel,
          photo: vp.photo,
          description: vp.description,
          specifications: vp.specifications,
          stock: vp.stock,
          price: vp.price ? parseFloat(vp.price.toString()) : null,
          currency: vp.currency,
          isActive: vp.isActive
        }
      }));

      return NextResponse.json({
        success: true,
        products: transformedVendorProductData
      });
    }

    if (vendorProductId) {
      // Fetch specific vendor product with vendor details
      const vendorProductData = await db.query.VendorProductTable.findFirst({
        where: eq(VendorProductTable.id, vendorProductId),
        with: {
          product: {
            with: {
              category: true
            }
          },
          vendor: {
            with: {
              user: true
            }
          }
        }
      });

      if (!vendorProductData) {
        return NextResponse.json(
          { error: 'Vendor product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        vendorProduct: {
          product: {
            id: vendorProductData.product.id,
            name: vendorProductData.product.name,
            description: vendorProductData.product.description,
            categoryName: vendorProductData.product.category?.name,
            requiredCertifications: vendorProductData.product.requiredCertifications,
            isActive: vendorProductData.product.isActive
          },
          vendorProductDetails: {
            id: vendorProductData.id,
            experienceYears: vendorProductData.experienceYears,
            pricingModel: vendorProductData.pricingModel,
            photo: vendorProductData.photo,
            description: vendorProductData.description,
            specifications: vendorProductData.specifications,
            stock: vendorProductData.stock,
            price: vendorProductData.price ? parseFloat(vendorProductData.price.toString()) : null,
            currency: vendorProductData.currency,
            isActive: vendorProductData.isActive
          },
          vendor: {
            id: vendorProductData.vendor.id,
            companyName: vendorProductData.vendor.companyName,
            primaryContactName: vendorProductData.vendor.primaryContactName,
            primaryContactEmail: vendorProductData.vendor.primaryContactEmail,
            primaryContactPhone: vendorProductData.vendor.primaryContactPhone,
            headquartersAddress: vendorProductData.vendor.headquartersAddress,
            pincode: vendorProductData.vendor.pincode,
            whatsappnumber: vendorProductData.vendor.whatsappnumber,
            businessOpeningDays: vendorProductData.vendor.businessOpeningDays,
            state: vendorProductData.vendor.state,
            city: vendorProductData.vendor.city,
            logo: vendorProductData.vendor.logo
          }
        }
      });
    }
  } catch (error: any) {
    console.error('Error fetching vendor product data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error fetching vendor product data', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    
    const vendorProduct = await db.insert(VendorProductTable).values({
      vendorId: body.vendorId,
      productId: body.productId,
      experienceYears: body.experienceYears,
      
      pricingModel: body.pricingModel,
     
      photo: body.photos,
      description: body.description,
      specifications: body.specifications,
      stock: body.stock,
      price:body.price,
      currency: body.currency,
      isActive: body.isActive ?? true,
    }).returning();

    return NextResponse.json(vendorProduct[0]);
  } catch (error: any) {
    console.error('Error creating vendor product:', error);
    return NextResponse.json(
      { error: 'Error creating vendor product', details: error.message },
      { status: 500 }
    );
  }
}