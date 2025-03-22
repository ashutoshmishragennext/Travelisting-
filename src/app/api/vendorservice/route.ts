
import { ServiceTable, VendorServiceTable, VendorProfileTable } from '@/drizzle/schema';


import { and, eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const vendorServiceId = searchParams.get('vendorServiceId');
    const categoryId = searchParams.get('categoryId');
    const serviceId = searchParams.get('serviceId');

    // If no parameters provided
    if (!vendorId && !vendorServiceId && !categoryId && !serviceId) {
      return NextResponse.json(
        { error: 'Either Vendor ID, Vendor Service ID, Category ID, or Service ID is required' },
        { status: 400 }
      );
    }

    // Existing vendor ID functionality
    if (vendorId) {
      const vendorServiceData = await db.query.VendorServiceTable.findMany({
        where: eq(VendorServiceTable.vendorId, vendorId),
        with: {
          service: {
            with: {
              category: true
            }
          },
          vendor: true
        }
      });

      if (!vendorServiceData || vendorServiceData.length === 0) {
        return NextResponse.json(
          { error: 'No services found for this vendor' },
          { status: 404 }
        );
      }

      const transformedVendorServiceData = vendorServiceData.map(vs => ({
        service: {
          id: vs.service.id,
          name: vs.service.name,
          description: vs.service.description,
          categoryName: vs.service.category?.name,
          requiredCertifications: vs.service.requiredCertifications,
          isActive: vs.service.isActive
        },
        vendorServiceDetails: {
          id: vs.id,
          experienceYears: vs.experienceYears,
          pricingModel: vs.pricingModel,
          photo: vs.photo,
          description: vs.description,
          price: vs.price ? parseFloat(vs.price.toString()) : null,
          location: vs.location,
          modeOfService: vs.modeOfService,
          currency: vs.currency,
          isActive: vs.isActive
        }
      }));

      return NextResponse.json({
        success: true,
        services: transformedVendorServiceData
      });
    }

    // Existing vendor service ID functionality
    if (vendorServiceId) {
      const vendorServiceData = await db.query.VendorServiceTable.findFirst({
        where: eq(VendorServiceTable.id, vendorServiceId),
        with: {
          service: {
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

      if (!vendorServiceData) {
        return NextResponse.json(
          { error: 'Vendor service not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        vendorService: {
          service: {
            id: vendorServiceData.service.id,
            name: vendorServiceData.service.name,
            description: vendorServiceData.service.description,
            categoryName: vendorServiceData.service.category?.name,
            requiredCertifications: vendorServiceData.service.requiredCertifications,
            isActive: vendorServiceData.service.isActive
          },
          vendorServiceDetails: {
            id: vendorServiceData.id,
            experienceYears: vendorServiceData.experienceYears,
            pricingModel: vendorServiceData.pricingModel,
            photo: vendorServiceData.photo,
            description: vendorServiceData.description,
            price: vendorServiceData.price ? parseFloat(vendorServiceData.price.toString()) : null,
            location: vendorServiceData.location,
            modeOfService: vendorServiceData.modeOfService,
            currency: vendorServiceData.currency,
            isActive: vendorServiceData.isActive
          },
          vendor: {
            id: vendorServiceData.vendor.id,
            companyName: vendorServiceData.vendor.companyName,
            primaryContactName: vendorServiceData.vendor.primaryContactName,
            primaryContactEmail: vendorServiceData.vendor.primaryContactEmail,
            primaryContactPhone: vendorServiceData.vendor.primaryContactPhone,
            headquartersAddress: vendorServiceData.vendor.headquartersAddress,
            pincode: vendorServiceData.vendor.pincode,
            whatsappnumber: vendorServiceData.vendor.whatsappnumber,
            businessOpeningDays: vendorServiceData.vendor.businessOpeningDays,
            state: vendorServiceData.vendor.state,
            city: vendorServiceData.vendor.city,
            logo: vendorServiceData.vendor.logo
          }
        }
      });
    }

    // Existing category ID functionality
    if (categoryId) {
      // First get all services in this category
      const servicesInCategory = await db.query.ServiceTable.findMany({
        where: eq(ServiceTable.categoryId, categoryId),
        columns: {
          id: true
        }
      });

      if (!servicesInCategory || servicesInCategory.length === 0) {
        return NextResponse.json({
          success: true,
          vendors: [] // Return empty array instead of error
        });
      }

      const serviceIds = servicesInCategory.map(s => s.id);

      // Then get all vendor services that match these service IDs
      const vendorServiceData = await db.query.VendorServiceTable.findMany({
        where: and(
          inArray(VendorServiceTable.serviceId, serviceIds),
          eq(VendorServiceTable.isActive, true)
        ),
        with: {
          service: {
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

      if (!vendorServiceData || vendorServiceData.length === 0) {
        return NextResponse.json({
          success: true,
          vendors: [] // Return empty array instead of error
        });
      }

      // Transform and group by vendor
      const vendorMap = new Map();

      vendorServiceData.forEach(vs => {
        const vendorId = vs.vendor.id;
        
        if (!vendorMap.has(vendorId)) {
          vendorMap.set(vendorId, {
            vendorDetails: {
              id: vs.vendor.id,
              companyName: vs.vendor.companyName,
              primaryContactName: vs.vendor.primaryContactName,
              primaryContactEmail: vs.vendor.primaryContactEmail,
              primaryContactPhone: vs.vendor.primaryContactPhone,
              headquartersAddress: vs.vendor.headquartersAddress,
              pincode: vs.vendor.pincode,
              whatsappnumber: vs.vendor.whatsappnumber,
              businessOpeningDays: vs.vendor.businessOpeningDays,
              state: vs.vendor.state,
              city: vs.vendor.city,
              logo: vs.vendor.logo,
              user: vs.vendor.user ? {
                name: vs.vendor.user.name,
                email: vs.vendor.user.email,
                mobile: vs.vendor.user.mobile,
                profilePic: vs.vendor.user.profilePic
              } : null
            },
            services: []
          });
        }

        vendorMap.get(vendorId).services.push({
          service: {
            id: vs.service.id,
            name: vs.service.name,
            description: vs.service.description,
            categoryName: vs.service.category?.name,
            requiredCertifications: vs.service.requiredCertifications,
            isActive: vs.service.isActive
          },
          vendorServiceDetails: {
            id: vs.id,
            experienceYears: vs.experienceYears,
            pricingModel: vs.pricingModel,
            photo: vs.photo,
            description: vs.description,
            price: vs.price ? parseFloat(vs.price.toString()) : null,
            location: vs.location,
            modeOfService: vs.modeOfService,
            currency: vs.currency,
            isActive: vs.isActive
          }
        });
      });

      const vendors = Array.from(vendorMap.values());

      return NextResponse.json({
        success: true,
        vendors: vendors
      });
    }

    // New service ID functionality
    if (serviceId) {
      // Get all vendor services for this specific service
      const vendorServiceData = await db.query.VendorServiceTable.findMany({
        where: and(
          eq(VendorServiceTable.serviceId, serviceId),
          eq(VendorServiceTable.isActive, true)
        ),
        with: {
          service: {
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

      if (!vendorServiceData || vendorServiceData.length === 0) {
        return NextResponse.json({
          success: true,
          vendors: [] // Return empty array instead of error
        });
      }

      // Transform and group by vendor
      const vendorMap = new Map();

      vendorServiceData.forEach(vs => {
        const vendorId = vs.vendor.id;
        
        if (!vendorMap.has(vendorId)) {
          vendorMap.set(vendorId, {
            vendorDetails: {
              id: vs.vendor.id,
              companyName: vs.vendor.companyName,
              primaryContactName: vs.vendor.primaryContactName,
              primaryContactEmail: vs.vendor.primaryContactEmail,
              primaryContactPhone: vs.vendor.primaryContactPhone,
              headquartersAddress: vs.vendor.headquartersAddress,
              pincode: vs.vendor.pincode,
              whatsappnumber: vs.vendor.whatsappnumber,
              businessOpeningDays: vs.vendor.businessOpeningDays,
              state: vs.vendor.state,
              city: vs.vendor.city,
              logo: vs.vendor.logo,
              user: vs.vendor.user ? {
                name: vs.vendor.user.name,
                email: vs.vendor.user.email,
                mobile: vs.vendor.user.mobile,
                profilePic: vs.vendor.user.profilePic
              } : null
            },
            services: []
          });
        }

        vendorMap.get(vendorId).services.push({
          service: {
            id: vs.service.id,
            name: vs.service.name,
            description: vs.service.description,
            categoryName: vs.service.category?.name,
            requiredCertifications: vs.service.requiredCertifications,
            isActive: vs.service.isActive
          },
          vendorServiceDetails: {
            id: vs.id,
            experienceYears: vs.experienceYears,
            pricingModel: vs.pricingModel,
            photo: vs.photo,
            description: vs.description,
            price: vs.price ? parseFloat(vs.price.toString()) : null,
            location: vs.location,
            modeOfService: vs.modeOfService,
            currency: vs.currency,
            isActive: vs.isActive
          }
        });
      });

      const vendors = Array.from(vendorMap.values());

      return NextResponse.json({
        success: true,
        vendors: vendors
      });
    }

  } catch (error: any) {
    console.error('Error fetching vendor data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error fetching vendor data', 
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
    
    
    const vendorService = await db.insert(VendorServiceTable).values({
      vendorId: body.vendorId,
      serviceId: body.serviceId,
      experienceYears: body.experienceYears,
     
      pricingModel: body.pricingModel,
     
      description: body.description,
      price:body.price,
      location:body.location,
      modeOfService:body.modeOfService,
      photo:body.photos,
     
      currency: body.currency,
      isActive: body.isActive ?? true, // Using the default value from your schema if not provided
    }).returning();

    return NextResponse.json(vendorService[0]);
  } catch (error :any ) {
    console.error('Error creating vendor service:', error);
    return NextResponse.json(
      { error: 'Error creating vendor service', details: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const body = await request.json();
    
    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    if (!body.id) {
      return NextResponse.json(
        { error: 'Vendor service ID is required' },
        { status: 400 }
      );
    }

    // Verify that the service belongs to the vendor
    const existingService = await db.query.VendorServiceTable.findFirst({
      where: and(
        eq(VendorServiceTable.id, body.id),
        eq(VendorServiceTable.vendorId, vendorId)
      )
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Vendor service not found or does not belong to this vendor' },
        { status: 404 }
      );
    }

    const updatedVendorService = await db
      .update(VendorServiceTable)
      .set({
        serviceId: body.serviceId,
        experienceYears: body.experienceYears,
        pricingModel: body.pricingModel,
        description: body.description,
        price: body.price,
        location: body.location,
        modeOfService: body.modeOfService,
        photo: body.photos,
        currency: body.currency,
        isActive: body.isActive
      })
      .where(eq(VendorServiceTable.id, body.id))
      .returning();

    return NextResponse.json({
      success: true,
      vendorService: updatedVendorService[0]
    });
    
  } catch (error: any) {
    console.error('Error updating vendor service:', error);
    return NextResponse.json(
      { error: 'Error updating vendor service', details: error.message },
      { status: 500 }
    );
  }
}