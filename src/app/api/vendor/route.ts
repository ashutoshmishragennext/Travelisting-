// app/api/vendor-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { VendorProfileTable, UserTable } from "@/drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all vendor profiles
export async function GET(request:NextRequest){
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get("userId");
        let vendorProfile = await db.select().from(VendorProfileTable)
        
        // If userId is provided, get specific vendor profile
        if (userId) {
           vendorProfile = await db.select().from(VendorProfileTable).where(eq(VendorProfileTable.userId, userId))
        }
          
          
          if (!vendorProfile) {
            return NextResponse.json(
              { error: "Vendor profile not found" },
              { status: 404 }
            );
          }

          return NextResponse.json(vendorProfile)
    } catch (error) {
        
    }
}

// POST new vendor profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists if userId is provided
    if (body.userId) {
      const existingUser = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, body.userId)
      });
      
      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      // Check if vendor profile already exists for this user
      const existingProfile = await db.query.VendorProfileTable.findFirst({
        where: eq(VendorProfileTable.userId, body.userId)
      });
      
      if (existingProfile) {
        return NextResponse.json(
          { error: "Vendor profile already exists for this user" },
          { status: 409 }
        );
      }
    }
    
    // Generate new UUID for vendor profile
    const vendorProfileId = uuidv4();
    
    // Prepare vendor profile data
    const vendorProfileData = {
      id: vendorProfileId,
      userId: body.userId || null,
      companyName: body.companyName,
      legalEntityType: body.legalEntityType || null,
      taxId: body.taxId || null,
      establishmentYear: body.establishmentYear || null,
      socialLinks: body.socialLinks || null,
      logo: body.logo || null,
      isDomestic: body.isDomestic || false,
      isInternational: body.isInternational || false,
      coverImage: body.coverImage || null,
      hotelChainIds: body.hotelChainIds || null,
      pictures: body.pictures || null,
      primaryContactName: body.primaryContactName || null,
      primaryContactEmail: body.primaryContactEmail || null,
      primaryContactPhone: body.primaryContactPhone || null,
      whatsappnumber: body.whatsappnumber || null,
      headquartersAddress: body.headquartersAddress || null,
      state: body.state || null,
      city: body.city || null,
      pincode: body.pincode || null,
      ourcustomers: body.ourcustomers || null,
      operatingCountries: body.operatingCountries || null,
      employeeCountRange: body.employeeCountRange || null,
      annualRevenueRange: body.annualRevenueRange || null,
      regulatoryLicenses: body.regulatoryLicenses || null,
      insuranceCoverage: body.insuranceCoverage || null,
      businessOpeningDays: body.businessOpeningDays || null,
      anotherMobileNumbers: body.anotherMobileNumbers || null,
      bussinessType: body.bussinessType || "B2B",
      advertisment: body.advertisment || null,
      anotheremails: body.anotheremails || null,
      businessTiming: body.businessTiming || null,
      paymentStatus: body.paymentStatus || null,
    };
    
    // Insert vendor profile
    const newVendorProfile = await db.insert(VendorProfileTable)
      .values(vendorProfileData)
      .returning();
    
    // If userId is provided, update the user's vendorProfileId
    if (body.userId) {
      await db.update(UserTable)
        .set({ vendorProfileId: vendorProfileId })
        .where(eq(UserTable.id, body.userId));
    }
    
    return NextResponse.json(newVendorProfile[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vendor profile:", error);
    return NextResponse.json(
      { error: "Failed to create vendor profile" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing vendor profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const vendorProfileId = searchParams.get("id");
    
    if (!vendorProfileId) {
      return NextResponse.json(
        { error: "Vendor profile ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the vendor profile exists
    const existingProfile = await db.query.VendorProfileTable.findFirst({
      where: eq(VendorProfileTable.id, vendorProfileId)
    });
    
    if (!existingProfile) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }
    
    // Update the vendor profile
    const updatedVendorProfile = await db
      .update(VendorProfileTable)
      .set({
        companyName: body.companyName || existingProfile.companyName,
        legalEntityType: body.legalEntityType || existingProfile.legalEntityType,
        taxId: body.taxId || existingProfile.taxId,
        establishmentYear: body.establishmentYear || existingProfile.establishmentYear,
        socialLinks: body.socialLinks || existingProfile.socialLinks,
        logo: body.logo || existingProfile.logo,
        isDomestic: body.isDomestic ?? existingProfile.isDomestic,
        isInternational: body.isInternational ?? existingProfile.isInternational,
        coverImage: body.coverImage || existingProfile.coverImage,
        hotelChainIds: body.hotelChainIds || existingProfile.hotelChainIds,
        pictures: body.pictures || existingProfile.pictures,
        primaryContactName: body.primaryContactName || existingProfile.primaryContactName,
        primaryContactEmail: body.primaryContactEmail || existingProfile.primaryContactEmail,
        primaryContactPhone: body.primaryContactPhone || existingProfile.primaryContactPhone,
        whatsappnumber: body.whatsappnumber || existingProfile.whatsappnumber,
        headquartersAddress: body.headquartersAddress || existingProfile.headquartersAddress,
        state: body.state || existingProfile.state,
        city: body.city || existingProfile.city,
        pincode: body.pincode || existingProfile.pincode,
        ourcustomers: body.ourcustomers || existingProfile.ourcustomers,
        operatingCountries: body.operatingCountries || existingProfile.operatingCountries,
        employeeCountRange: body.employeeCountRange || existingProfile.employeeCountRange,
        annualRevenueRange: body.annualRevenueRange || existingProfile.annualRevenueRange,
        regulatoryLicenses: body.regulatoryLicenses || existingProfile.regulatoryLicenses,
        insuranceCoverage: body.insuranceCoverage || existingProfile.insuranceCoverage,
        businessOpeningDays: body.businessOpeningDays || existingProfile.businessOpeningDays,
        anotherMobileNumbers: body.anotherMobileNumbers || existingProfile.anotherMobileNumbers,
        bussinessType: body.bussinessType || existingProfile.bussinessType,
        advertisment: body.advertisment || existingProfile.advertisment,
        anotheremails: body.anotheremails || existingProfile.anotheremails,
        businessTiming: body.businessTiming || existingProfile.businessTiming,
        paymentStatus: body.paymentStatus || existingProfile.paymentStatus,
      })
      .where(eq(VendorProfileTable.id, vendorProfileId))
      .returning();
    
    return NextResponse.json(updatedVendorProfile[0], { status: 200 });
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    return NextResponse.json(
      { error: "Failed to update vendor profile" },
      { status: 500 }
    );
  }
}
