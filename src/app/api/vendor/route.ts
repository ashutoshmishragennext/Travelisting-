import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { 
  VendorProfileTable, 
  VendorServiceTable, 
  ServiceTable, 
  ServiceCategoryTable,
  CertificationTable,
  ReferenceTable,
  UserTable
} from '@/drizzle/schema'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    const query = db
      .select({
        vendor: VendorProfileTable,
        services: VendorServiceTable,
        serviceDetails: ServiceTable,
        serviceCategory: ServiceCategoryTable,
        certifications: CertificationTable,
        references: ReferenceTable,
      })
      .from(VendorProfileTable)
      .leftJoin(VendorServiceTable, eq(VendorProfileTable.id, VendorServiceTable.vendorId))
      .leftJoin(ServiceTable, eq(VendorServiceTable.serviceId, ServiceTable.id))
      .leftJoin(ServiceCategoryTable, eq(ServiceTable.categoryId, ServiceCategoryTable.id))
      .leftJoin(CertificationTable, eq(VendorProfileTable.id, CertificationTable.vendorId))
      .leftJoin(ReferenceTable, eq(VendorProfileTable.id, ReferenceTable.vendorId))

    if (userId) {
      query.where(eq(VendorProfileTable.userId, userId))
    } else if (id) {
      query.where(eq(VendorProfileTable.id, id))
    }
    
    const vendors = await query

    if (vendors.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No vendors found'
      }, { status: 404 })
    }

    const formatDate = (date: Date | string | null) => {
      if (!date) return null;
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.getTime()) 
        ? d.toISOString().split('T')[0] 
        : null;
    };

    const transformedVendors = vendors.map(vendor => ({
      // Basic Information
      id: vendor.vendor.id,
      userId: vendor.vendor.userId,
      companyName: vendor.vendor.companyName,
      legalEntityType: vendor.vendor.legalEntityType,
      taxId: vendor.vendor.taxId,
      establishmentYear: vendor.vendor.establishmentYear,
      socialLinks: vendor.vendor.socialLinks ? JSON.parse(JSON.stringify(vendor.vendor.socialLinks)) : null,
      logo: vendor.vendor.logo,
      coverImage: vendor.vendor.coverImage,
      pictures: vendor.vendor.pictures,
      ourcustomers: vendor.vendor.ourcustomers,
      paymentStatus: vendor.vendor.paymentStatus,
      
      // Contact Information
      primaryContactName: vendor.vendor.primaryContactName,
      primaryContactEmail: vendor.vendor.primaryContactEmail,
      primaryContactPhone: vendor.vendor.primaryContactPhone,
      whatsappnumber: vendor.vendor.whatsappnumber,
      anotherMobileNumbers: vendor.vendor.anotherMobileNumbers,
      anotheremails: vendor.vendor.anotheremails,
      
      // Address Information
      headquartersAddress: vendor.vendor.headquartersAddress,
      state: vendor.vendor.state,
      city: vendor.vendor.city,
      pincode: vendor.vendor.pincode,
      operatingCountries: vendor.vendor.operatingCountries,
      
      // Business Information
      employeeCountRange: vendor.vendor.employeeCountRange,
      annualRevenueRange: vendor.vendor.annualRevenueRange,
      regulatoryLicenses: vendor.vendor.regulatoryLicenses,
      insuranceCoverage: vendor.vendor.insuranceCoverage,
      
      // Operating Hours
      businessOpeningDays: vendor.vendor.businessOpeningDays,
      businessTiming: vendor.vendor.businessTiming,
      
      // Timestamps
      createdAt: formatDate(vendor.vendor.createdAt),
      updatedAt: formatDate(vendor.vendor.updatedAt),

      // Related Data
      services: vendor.services ? [{
        id: vendor.services.id,
        serviceId: vendor.services.serviceId,
        serviceName: vendor.serviceDetails?.name,
        serviceCategory: vendor.serviceCategory?.name,
        serviceDescription: vendor.serviceDetails?.description,
        experienceYears: vendor.services.experienceYears,
        photo: vendor.services.photo,
        modeOfService: vendor.services.modeOfService,
        description: vendor.services.description,
        pricingModel: vendor.services.pricingModel,
        price: vendor.services.price ? parseFloat(vendor.services.price.toString()) : null,
        location: vendor.services.location,
        currency: vendor.services.currency,
        isActive: vendor.services.isActive,
        requiredCertifications: vendor.serviceDetails?.requiredCertifications
      }] : [],
      
      certifications: vendor.certifications ? [{
        id: vendor.certifications.id,
        name: vendor.certifications.name,
        issuer: vendor.certifications.issuer,
        issueDate: formatDate(vendor.certifications.issueDate),
        expiryDate: formatDate(vendor.certifications.expiryDate),
        certificationNumber: vendor.certifications.certificationNumber,
        verificationUrl: vendor.certifications.verificationUrl
      }] : [],
      
      references: vendor.references ? [{
        id: vendor.references.id,
        clientCompanyName: vendor.references.clientCompanyName,
        clientIndustry: vendor.references.clientIndustry,
        projectDescription: vendor.references.projectDescription,
        servicePeriodStart: formatDate(vendor.references.servicePeriodStart),
        servicePeriodEnd: formatDate(vendor.references.servicePeriodEnd),
        contactPersonName: vendor.references.contactPersonName,
        contactEmail: vendor.references.contactEmail,
        isPublic: vendor.references.isPublic
      }] : []
    }))

    return NextResponse.json({
      success: true,
      data: id || userId ? transformedVendors[0] : transformedVendors,
      // data: vendors,
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendors'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      // Basic Information
      companyName,
      legalEntityType,
      taxId,
      establishmentYear,
      socialLinks,
      logo,
      coverImage,
      pictures,
      userId,
      ourcustomers,

      // Contact Information
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone,
      whatsappnumber,
      anotherMobileNumbers,
      anotheremails,
      paymentStatus,
      // Address Information
      headquartersAddress,
      state,
      city,
      pincode,
      operatingCountries,

      // Business Information
      employeeCountRange,
      annualRevenueRange,
      regulatoryLicenses,
      insuranceCoverage,

      // Operating Hours
      businessOpeningDays,
      businessTiming,

      // Related Data
      services,
      certifications,
      references
    } = body

    // Create vendor profile
    const [vendor] = await db.insert(VendorProfileTable).values({
      companyName,
      legalEntityType,
      taxId,
      establishmentYear,
      socialLinks,
      logo,
      ourcustomers,
      coverImage,
      pictures,
      userId,
      paymentStatus,
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone,
      whatsappnumber,
      anotherMobileNumbers,
      anotheremails,
      headquartersAddress,
      state,
      city,
      pincode,
      operatingCountries,
      employeeCountRange,
      annualRevenueRange,
      regulatoryLicenses,
      insuranceCoverage,
      businessOpeningDays,
      businessTiming,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    // Insert services if provided
    if (services && Array.isArray(services)) {
      await db.insert(VendorServiceTable)
        .values(services.map(service => ({
          vendorId: vendor.id,
          serviceId: service.serviceId,
          experienceYears: service.experienceYears,
          photo: service.photo,
          modeOfService: service.modeOfService,
          description: service.description,
          pricingModel: service.pricingModel,
          price: service.price,
          location: service.location,
          currency: service.currency,
          isActive: service.isActive ?? true
        })))
    }

    // Insert certifications if provided
    // if (certifications && Array.isArray(certifications)) {
    //   await db.insert(CertificationTable)
    //     .values(certifications.map(cert => ({
    //       vendorId: vendor.id,
    //       name: cert.name,
    //       issuer: cert.issuer,
    //       issueDate: new Date(cert.issueDate),
    //       expiryDate: new Date(cert.expiryDate),
    //       certificationNumber: cert.certificationNumber,
    //       verificationUrl: cert.verificationUrl
    //     })))
    // }

    // Insert references if provided
    // if (references && Array.isArray(references)) {
    //   await db.insert(ReferenceTable)
    //     .values(references.map(ref => ({
    //       vendorId: vendor.id,
    //       clientCompanyName: ref.clientCompanyName,
    //       clientIndustry: ref.clientIndustry,
    //       projectDescription: ref.projectDescription,
    //       servicePeriodStart: new Date(ref.servicePeriodStart),
    //       servicePeriodEnd: new Date(ref.servicePeriodEnd),
    //       contactPersonName: ref.contactPersonName,
    //       contactEmail: ref.contactEmail,
    //       isPublic: ref.isPublic ?? false
    //     })))
    // }

    // Fetch the created vendor with all relations
    const [createdVendor] = await db
      .select({
        vendor: VendorProfileTable,
        services: VendorServiceTable,
        serviceDetails: ServiceTable,
        serviceCategory: ServiceCategoryTable,
        certifications: CertificationTable,
        references: ReferenceTable,
      })
      .from(VendorProfileTable)
      .leftJoin(VendorServiceTable, eq(VendorProfileTable.id, VendorServiceTable.vendorId))
      .leftJoin(ServiceTable, eq(VendorServiceTable.serviceId, ServiceTable.id))
      .leftJoin(ServiceCategoryTable, eq(ServiceTable.categoryId, ServiceCategoryTable.id))
      .leftJoin(CertificationTable, eq(VendorProfileTable.id, CertificationTable.vendorId))
      .leftJoin(ReferenceTable, eq(VendorProfileTable.id, ReferenceTable.vendorId))
      .where(eq(VendorProfileTable.id, vendor.id))

    const formatDate = (date: Date | string | null) => {
      if (!date) return null;
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.getTime()) 
        ? d.toISOString().split('T')[0] 
        : null;
    };

    // Transform the response to match GET format
    const transformedVendor = {
      id: createdVendor.vendor.id,
      userId: createdVendor.vendor.userId,
      companyName: createdVendor.vendor.companyName,
      legalEntityType: createdVendor.vendor.legalEntityType,
      taxId: createdVendor.vendor.taxId,
      establishmentYear: createdVendor.vendor.establishmentYear,
      socialLinks: createdVendor.vendor.socialLinks,
      logo: createdVendor.vendor.logo,
      paymentStatus:createdVendor.vendor.paymentStatus,
      coverImage: createdVendor.vendor.coverImage,
      pictures: createdVendor.vendor.pictures,
      primaryContactName: createdVendor.vendor.primaryContactName,
      primaryContactEmail: createdVendor.vendor.primaryContactEmail,
      primaryContactPhone: createdVendor.vendor.primaryContactPhone,
      whatsappnumber: createdVendor.vendor.whatsappnumber,
      anotherMobileNumbers: createdVendor.vendor.anotherMobileNumbers,
      anotheremails: createdVendor.vendor.anotheremails,
      headquartersAddress: createdVendor.vendor.headquartersAddress,
      state: createdVendor.vendor.state,
      city: createdVendor.vendor.city,
      pincode: createdVendor.vendor.pincode,
      operatingCountries: createdVendor.vendor.operatingCountries,
      employeeCountRange: createdVendor.vendor.employeeCountRange,
      annualRevenueRange: createdVendor.vendor.annualRevenueRange,
      regulatoryLicenses: createdVendor.vendor.regulatoryLicenses,
      insuranceCoverage: createdVendor.vendor.insuranceCoverage,
      businessOpeningDays: createdVendor.vendor.businessOpeningDays,
      businessTiming: createdVendor.vendor.businessTiming,
      createdAt: formatDate(createdVendor.vendor.createdAt),
      updatedAt: formatDate(createdVendor.vendor.updatedAt),
      services: createdVendor.services ? [{
        id: createdVendor.services.id,
        serviceId: createdVendor.services.serviceId,
        serviceName: createdVendor.serviceDetails?.name,
        serviceCategory: createdVendor.serviceCategory?.name,
        serviceDescription: createdVendor.serviceDetails?.description,
        experienceYears: createdVendor.services.experienceYears,
        photo: createdVendor.services.photo,
        modeOfService: createdVendor.services.modeOfService,
        description: createdVendor.services.description,
        pricingModel: createdVendor.services.pricingModel,
        price: createdVendor.services.price ? parseFloat(createdVendor.services.price.toString()) : null,
        location: createdVendor.services.location,
        currency: createdVendor.services.currency,
        isActive: createdVendor.services.isActive,
        requiredCertifications: createdVendor.serviceDetails?.requiredCertifications
      }] : [],
      certifications: createdVendor.certifications ? [{
        id: createdVendor.certifications.id,
        name: createdVendor.certifications.name,
        issuer: createdVendor.certifications.issuer,
        issueDate: formatDate(createdVendor.certifications.issueDate),
        expiryDate: formatDate(createdVendor.certifications.expiryDate),
        certificationNumber: createdVendor.certifications.certificationNumber,
        verificationUrl: createdVendor.certifications.verificationUrl
      }] : [],
      references: createdVendor.references ? [{
        id: createdVendor.references.id,
        clientCompanyName: createdVendor.references.clientCompanyName,
        clientIndustry: createdVendor.references.clientIndustry,
        projectDescription: createdVendor.references.projectDescription,
        servicePeriodStart: formatDate(createdVendor.references.servicePeriodStart),
        servicePeriodEnd: formatDate(createdVendor.references.servicePeriodEnd),
        contactPersonName: createdVendor.references.contactPersonName,
        contactEmail: createdVendor.references.contactEmail,
        isPublic: createdVendor.references.isPublic
      }] : []
    }

    return NextResponse.json({
      success: true,
      data: transformedVendor
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating vendor:', error)
    
    return NextResponse.json({ 
      success: false,
      error: 'Error creating vendor', 
      details: error.message,
      code: error.code 
    }, { status: 500 })
  }
}
export async function PUT(request: Request) {
  try {

    console.log("vendor started:")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id && !userId) {
      return NextResponse.json({
        success: false,
        error: 'Vendor ID or User ID is required'
      }, { status: 400 })
    }

    const body = await request.json()
    
    console.log("body", body)


    
    const {
      // Basic Information
      companyName,
      legalEntityType,
      taxId,
      establishmentYear,
      socialLinks,
      logo,
      ourcustomers,
      coverImage,
      pictures,
      paymentStatus,

      // Contact Information
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone,
      whatsappnumber,
      anotherMobileNumbers,
      anotheremails,

      // Address Information
      headquartersAddress,
      state,
      city,
      pincode,
      operatingCountries,

      // Business Information
      employeeCountRange,
      annualRevenueRange,
      regulatoryLicenses,
      insuranceCoverage,
      
      // Operating Hours
      businessOpeningDays,
      businessTiming,

      // Related Services
      services,
      
      // Certifications
      certifications,
      
      // References
      references
    } = body
    if (!id && !userId) {
      return NextResponse.json({
        success: false,
        error: 'Vendor ID or User ID is required'
      }, { status: 400 })
    }



    // Update main vendor profile
    const updateQuery = db
  .update(VendorProfileTable)
  .set({
    companyName,
    legalEntityType,
    taxId,
    establishmentYear,
    socialLinks,
    logo,
    ourcustomers,
    coverImage,
    paymentStatus,
    pictures,
    primaryContactName,
    primaryContactEmail,
    primaryContactPhone,
    whatsappnumber,
    anotherMobileNumbers,
    anotheremails,
    headquartersAddress,
    state,
    city,
    pincode,
    operatingCountries,
    employeeCountRange,
    annualRevenueRange,
    regulatoryLicenses,
    insuranceCoverage,
    businessOpeningDays,
    businessTiming,
    updatedAt: new Date()
  })

      if (userId) {
        updateQuery.where(eq(VendorProfileTable.userId, userId))
      } else if (id) {
        updateQuery.where(eq(VendorProfileTable.id, id))
      }
      
      const [updatedVendor] = await updateQuery.returning()

    if (!updatedVendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor not found'
      }, { status: 404 })
    }

    // Update services if provided
    if (services && Array.isArray(services)) {
      // First delete existing services
      await db
        .delete(VendorServiceTable)
        .where(eq(VendorServiceTable.vendorId, updatedVendor.id))

      // Then insert new services
      if (services.length > 0) {
        await db.insert(VendorServiceTable)
          .values(services.map(service => ({
            vendorId: updatedVendor.id,
            serviceId: service.serviceId,
            experienceYears: service.experienceYears,
            photo: service.photo,
            modeOfService: service.modeOfService,
            description: service.description,
            pricingModel: service.pricingModel,
            price: service.price,
            location: service.location,
            currency: service.currency,
            isActive: service.isActive ?? true
          })))
      }
    }

    // Update certifications if provided
    if (certifications && Array.isArray(certifications)) {
      // Delete existing certifications
      await db
        .delete(CertificationTable)
        .where(eq(CertificationTable.vendorId, updatedVendor.id))

      // Insert new certifications
      // if (certifications.length > 0) {
      //   await db.insert(CertificationTable)
      //     .values(certifications.map(cert => ({
      //       vendorId: updatedVendor.id,
      //       name: cert.name,
      //       issuer: cert.issuer,
      //       issueDate: new Date(cert.issueDate),
      //       expiryDate: new Date(cert.expiryDate),
      //       certificationNumber: cert.certificationNumber,
      //       verificationUrl: cert.verificationUrl
      //     })))
      // }
    }

    // Update references if provided
    if (references && Array.isArray(references)) {
      // Delete existing references
      await db
        .delete(ReferenceTable)
        .where(eq(ReferenceTable.vendorId, updatedVendor.id))

      // Insert new references
      // if (references.length > 0) {
      //   await db.insert(ReferenceTable)
      //     .values(references.map(ref => ({
      //       vendorId: updatedVendor.id,
      //       clientCompanyName: ref.clientCompanyName,
      //       clientIndustry: ref.clientIndustry,
      //       projectDescription: ref.projectDescription,
      //       servicePeriodStart: new Date(ref.servicePeriodStart),
      //       servicePeriodEnd: new Date(ref.servicePeriodEnd),
      //       contactPersonName: ref.contactPersonName,
      //       contactEmail: ref.contactEmail,
      //       isPublic: ref.isPublic ?? false
      //     })))
      // }
    }

    // Fetch updated vendor data with all relations
    const [updatedVendorWithRelations] = await db
      .select({
        vendor: VendorProfileTable,
        services: VendorServiceTable,
        serviceDetails: ServiceTable,
        serviceCategory: ServiceCategoryTable,
        certifications: CertificationTable,
        references: ReferenceTable,
      })
      .from(VendorProfileTable)
      .leftJoin(VendorServiceTable, eq(VendorProfileTable.id, VendorServiceTable.vendorId))
      .leftJoin(ServiceTable, eq(VendorServiceTable.serviceId, ServiceTable.id))
      .leftJoin(ServiceCategoryTable, eq(ServiceTable.categoryId, ServiceCategoryTable.id))
      .leftJoin(CertificationTable, eq(VendorProfileTable.id, CertificationTable.vendorId))
      .leftJoin(ReferenceTable, eq(VendorProfileTable.id, ReferenceTable.vendorId))
      .where(eq(VendorProfileTable.id, updatedVendor.id))

    // Helper function to safely format date
    const formatDate = (date: Date | string | null) => {
      if (!date) return null;
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.getTime()) 
        ? d.toISOString().split('T')[0] 
        : null;
    };

    // Transform vendor data to match the GET endpoint format
    const transformedVendor = {
      id: updatedVendorWithRelations.vendor.id,
      companyName: updatedVendorWithRelations.vendor.companyName,
      legalEntityType: updatedVendorWithRelations.vendor.legalEntityType,
      taxId: updatedVendorWithRelations.vendor.taxId,
      establishmentYear: updatedVendorWithRelations.vendor.establishmentYear,
      socialLinks: updatedVendorWithRelations.vendor.socialLinks ? JSON.parse(JSON.stringify(updatedVendorWithRelations.vendor.socialLinks)) : null,
      logo: updatedVendorWithRelations.vendor.logo,
      ourcustomers:updatedVendorWithRelations.vendor.ourcustomers,
      coverImage: updatedVendorWithRelations.vendor.coverImage,
      paymentStatus: updatedVendorWithRelations.vendor.paymentStatus,
      pictures: updatedVendorWithRelations.vendor.pictures,
      whatsappnumber: updatedVendorWithRelations.vendor.whatsappnumber,
      primaryContactName: updatedVendorWithRelations.vendor.primaryContactName,
      primaryContactEmail: updatedVendorWithRelations.vendor.primaryContactEmail,
      primaryContactPhone: updatedVendorWithRelations.vendor.primaryContactPhone,
      headquartersAddress: updatedVendorWithRelations.vendor.headquartersAddress,
      state: updatedVendorWithRelations.vendor.state,
      city: updatedVendorWithRelations.vendor.city,
      pincode: updatedVendorWithRelations.vendor.pincode,
      operatingCountries: updatedVendorWithRelations.vendor.operatingCountries,
      employeeCountRange: updatedVendorWithRelations.vendor.employeeCountRange,
      annualRevenueRange: updatedVendorWithRelations.vendor.annualRevenueRange,
      regulatoryLicenses: updatedVendorWithRelations.vendor.regulatoryLicenses,
      insuranceCoverage: updatedVendorWithRelations.vendor.insuranceCoverage,
      businessOpeningDays: updatedVendorWithRelations.vendor.businessOpeningDays,
      businessTiming: updatedVendorWithRelations.vendor.businessTiming,
      services: updatedVendorWithRelations.services ? [{
        serviceId: updatedVendorWithRelations.services.serviceId,
        serviceName: updatedVendorWithRelations.serviceDetails?.name,
        serviceCategory: updatedVendorWithRelations.serviceCategory?.name,
        serviceDescription: updatedVendorWithRelations.serviceDetails?.description,
        experienceYears: updatedVendorWithRelations.services.experienceYears,
        modeOfService: updatedVendorWithRelations.services.modeOfService,
        pricingModel: updatedVendorWithRelations.services.pricingModel,
        price: updatedVendorWithRelations.services.price ? parseFloat(updatedVendorWithRelations.services.price.toString()) : null,
        currency: updatedVendorWithRelations.services.currency,
        isActive: updatedVendorWithRelations.services.isActive,
        requiredCertifications: updatedVendorWithRelations.serviceDetails?.requiredCertifications
      }] : [],
      certifications: updatedVendorWithRelations.certifications ? [{
        name: updatedVendorWithRelations.certifications.name,
        issuer: updatedVendorWithRelations.certifications.issuer,
        issueDate: formatDate(updatedVendorWithRelations.certifications.issueDate),
        expiryDate: formatDate(updatedVendorWithRelations.certifications.expiryDate),
        certificationNumber: updatedVendorWithRelations.certifications.certificationNumber,
        verificationUrl: updatedVendorWithRelations.certifications.verificationUrl
      }] : [],
      references: updatedVendorWithRelations.references ? [{
        clientCompanyName: updatedVendorWithRelations.references.clientCompanyName,
        clientIndustry: updatedVendorWithRelations.references.clientIndustry,
        projectDescription: updatedVendorWithRelations.references.projectDescription,
        servicePeriodStart: formatDate(updatedVendorWithRelations.references.servicePeriodStart),
        servicePeriodEnd: formatDate(updatedVendorWithRelations.references.servicePeriodEnd),
        contactPersonName: updatedVendorWithRelations.references.contactPersonName,
        contactEmail: updatedVendorWithRelations.references.contactEmail,
        isPublic: updatedVendorWithRelations.references.isPublic
      }] : []
    }

    return NextResponse.json({
      success: true,
      data: transformedVendor,
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error updating vendor:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update vendor',
      details: error.message
    }, { status: 500 })
  }
}