import {
  UserTable,
  VendorProfileTable,
  // ServiceCategoryTable,
  // ServiceTable,
  // VendorServiceTable,
  // CertificationTable,
  // ReferenceTable,
  EmailVerificationTokenTable,
  PasswordResetTokenTable,
} from "@/drizzle/schema";

export const modelMap: Record<string, any> = {
  user: {
    model: UserTable,
    attributes: [
      "id",
      "name",
      "email",
      "emailVerified",
      "emailVerifToken",
      "password",
      "mobile",
      "role",
      "profilePic",
      "coverPic",
      "secureProfilePic",
      "createdAt",
      "updatedAt",
    ],
  },
  vendor: {
    model: VendorProfileTable,
    attributes: [
      "id",
      "companyName",
      "legalEntityType",
      "taxId",
      "establishmentYear",
      "socialLinks",
      "logo",
      "coverImage",
      "pictures",
      "primaryContactName",
      "primaryContactEmail",
      "primaryContactPhone",
      "headquartersAddress",
      "operatingCountries",
      "employeeCountRange",
      "annualRevenueRange",
      "regulatoryLicenses",
      "insuranceCoverage",
      "createdAt",
      "updatedAt",
      "userId",
    ],
  },
  // serviceCategory: {
  //   model: ServiceCategoryTable,
  //   attributes: [
  //     "id",
  //     "name",
  //     "description",
  //     "isActive",
  //   ],
  // },
  // service: {
  //   model: ServiceTable,
  //   attributes: [
  //     "id",
  //     "categoryId",
  //     "name",
  //     "description",
  //     "requiredCertifications",
  //     "isActive",
  //   ],
  // },
  // vendorService: {
  //   model: VendorServiceTable,
  //   attributes: [
  //     "id",
  //     "vendorId",
  //     "serviceId",
  //     "experienceYears",
  //     "clientCount",
  //     "pricingModel",
  //     "rateRangeMin",
  //     "rateRangeMax",
  //     "currency",
  //     "isActive",
  //   ],
  // },
  // certification: {
  //   model: CertificationTable,
  //   attributes: [
  //     "id",
  //     "vendorId",
  //     "name",
  //     "issuer",
  //     "issueDate",
  //     "expiryDate",
  //     "certificationNumber",
  //     "verificationUrl",
  //   ],
  // },
  // reference: {
  //   model: ReferenceTable,
  //   attributes: [
  //     "id",
  //     "vendorId",
  //     "clientCompanyName",
  //     "clientIndustry",
  //     "projectDescription",
  //     "servicePeriodStart",
  //     "servicePeriodEnd",
  //     "contactPersonName",
  //     "contactEmail",
  //     "isPublic",
  //   ],
  // },
  emailVerificationToken: {
    model: EmailVerificationTokenTable,
    attributes: [
      "id",
      "email",
      "token",
      "expiresAt",
    ],
  },
  passwordResetToken: {
    model: PasswordResetTokenTable,
    attributes: [
      "id",
      "email", 
      "token",
      "expiresAt",
    ],
  },
};