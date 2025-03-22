import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// =====================
// Enums
// =====================
export const UserRole = pgEnum("user_role", [
  "USER",
  "SALE_PERSON",
  "SUPER_ADMIN",
  "VENDOR",
]);
export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

// =====================
// Tables
// =====================

// User Table

export const UserTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    emailVerifToken: varchar("email_verif_token", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    mobile: text("mobile"),
    role: UserRole("role").default("USER").notNull(),
vendorProfileId: uuid("vendor_profile_id").references(
      () => VendorProfileTable.id
    ),
    profilePic: text("profile_pic"),
    coverPic: text("cover_pic"),
    secureProfilePic: text("secure_profile_pic"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => ({
    emailKey: uniqueIndex("users_email_key").on(table.email),
    nameEmailMobileIdx: index("users_name_email_mobile_idx").on(
      table.name,
      table.email,
      table.mobile
    ),
  })
);

export const VendorProfileTable = pgTable("vendor_profiles", {
  id: uuid("vendor_id").defaultRandom().primaryKey().notNull(),
  userId:uuid("user_id"),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  legalEntityType: varchar("legal_entity_type", { length: 50 }),
  taxId: varchar("tax_id", { length: 50 }),
  establishmentYear: integer("establishment_year"),
  socialLinks: json("social_links"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  pictures: json("pictures"),
  primaryContactName: varchar("primary_contact_name", { length: 100 }),
  primaryContactEmail: varchar("primary_contact_email", { length: 100 }),
  primaryContactPhone: varchar("primary_contact_phone", { length: 20 }),
  whatsappnumber: varchar("whatsapp_number", { length: 20 }),
  headquartersAddress: text("headquarters_address"),
  state: text("state"),
  city: text("city"),
  pincode: text("pincode"),
  ourcustomers: text("our_customers").array(),
  operatingCountries: text("operating_countries").array(),
  employeeCountRange: varchar("employee_count_range", { length: 50 }),
  annualRevenueRange: varchar("annual_revenue_range", { length: 50 }),
  regulatoryLicenses: text("regulatory_licenses").array(),
  insuranceCoverage: json("insurance_coverage"),
  businessOpeningDays: text("business_opening_days").array(),
  anotherMobileNumbers: text("another_mobile_numbers").array(),
  advertisment: text("advertisment").array(),
  anotheremails: text("another_emails").array(),
  businessTiming: json("business_timing"),
  paymentStatus: text("payment_status"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Service Category Table
export const ServiceCategoryTable = pgTable("service_categories", {
  id: uuid("category_id").defaultRandom().primaryKey().notNull(),
  name: varchar("category_name", { length: 100 }).notNull(),
  logo: text("logo"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Service Table
export const ServiceTable = pgTable("services", {
  id: uuid    ("service_id").defaultRandom().primaryKey().notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => ServiceCategoryTable.id),
  name: varchar("service_name", { length: 200 }).notNull(),
  description: text("description"),
  image:text("logo"),
  requiredCertifications: text("required_certifications").array(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Vendor Service Table
export const VendorServiceTable = pgTable(
  "vendor_services",
  {
    id: uuid("vendor_service_id").defaultRandom().primaryKey().notNull(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => VendorProfileTable.id),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => ServiceTable.id),
    experienceYears: integer("experience_years"),
    photo: text("photo").array(),
    modeOfService: varchar("mode_of_service", { length: 50 }),

    description: varchar("description", { length: 500 }),
    pricingModel: varchar("pricing_model", { length: 50 }),
    price: varchar("price", { length: 50 }),
    location: varchar("location", { length: 150 }),

    currency: varchar("currency", { length: 3 }),
    isActive: boolean("is_currently_offered").default(true).notNull(),
  },
  (table) => ({
    vendorServiceUnique: uniqueIndex("vendor_service_unique_idx").on(
      table.vendorId,
      table.serviceId
    ),
  })
);

export const ProductCategoryTable = pgTable("product_categories", {
  id: uuid("category_id").defaultRandom().primaryKey().notNull(),
  name: varchar("category_name", { length: 100 }).notNull(),
  logo: text("logo"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
});

// Product Table
export const ProductTable = pgTable("products", {
  id: uuid("product_id").defaultRandom().primaryKey().notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => ProductCategoryTable.id),
  name: varchar("product_name", { length: 200 }).notNull(),
  description: text("description"),
  image:text("logo"),
  requiredCertifications: text("required_certifications").array(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Vendor Product Table
export const VendorProductTable = pgTable(
  "vendor_products",
  {
    id: uuid("vendor_product_id").defaultRandom().primaryKey().notNull(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => VendorProfileTable.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => ProductTable.id),
    experienceYears: integer("experience_years"),
    photo: text("photo").array(),

    description: text("description"),
    specifications: text("specifications"),
    stock: integer("stock"),

    pricingModel: varchar("pricing_model", { length: 50 }),
    price: text("price"),
    // rateRangeMax: decimal("rate_range_max", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }),
    isActive: boolean("is_currently_offered").default(true).notNull(),
  },
  (table) => ({
    vendorProductUnique: uniqueIndex("vendor_product_unique_idx").on(
      table.vendorId,
      table.productId
    ),
  })
);
// Certification Table
export const CertificationTable = pgTable("certifications", {
  id: uuid("certification_id").defaultRandom().primaryKey().notNull(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => VendorProfileTable.id),
  name: varchar("certification_name", { length: 200 }).notNull(),
  issuer: varchar("issuing_body", { length: 200 }).notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  certificationNumber: varchar("certification_number", { length: 100 }),
  verificationUrl: varchar("verification_url", { length: 200 }),
});

// Reference Table
export const ReferenceTable = pgTable("references", {
  id: uuid("reference_id").defaultRandom().primaryKey().notNull(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => VendorProfileTable.id),
  clientCompanyName: varchar("client_company_name", { length: 200 }).notNull(),
  clientIndustry: varchar("client_industry", { length: 100 }).notNull(),
  projectDescription: text("project_description"),
  servicePeriodStart: date("service_period_start").notNull(),
  servicePeriodEnd: date("service_period_end").notNull(),
  contactPersonName: varchar("contact_person_name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 100 }).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
});

// Email Verification Tokens
export const EmailVerificationTokenTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenKey: uniqueIndex("email_verification_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    tokenKey: uniqueIndex("email_verification_tokens_token_key").on(
      table.token
    ),
  })
);

// Password Reset Tokens
export const PasswordResetTokenTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenKey: uniqueIndex("password_reset_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    tokenKey: uniqueIndex("password_reset_tokens_token_key").on(table.token),
  })
);
export const PlanTable = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  validityYears: integer("validity_years").notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  features: json("features"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Advertisement Plan Table
export const AdvertisementPlanTable = pgTable("advertisement_plans", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => VendorProfileTable.id),
  categoryType: varchar("category_type", { length: 50 }).notNull(), // 'SERVICE' or 'PRODUCT'
  categoryId: uuid("category_id").notNull(), // References either ServiceCategoryTable or ProductCategoryTable
  itemId: uuid("item_id"), // References either ServiceTable or ProductTable
  image: text("image"),
  contactNumber: varchar("contact_number", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const VendorPaymentTable = pgTable("vendor_payments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => VendorProfileTable.id),
  planId: uuid("plan_id")
    .notNull()
    .references(() => PlanTable.id),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  paymentId: varchar("payment_id", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const SalesCommissionTable = pgTable("sales_commissions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  salesPersonId: uuid("sales_person_id")
    
    .references(() => UserTable.id),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => VendorProfileTable.id),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => VendorPaymentTable.id),
  planId: uuid("plan_id")
    .notNull()
    .references(() => PlanTable.id),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
// =====================
// Relations
// =====================

export const vendorPaymentRelations = relations(VendorPaymentTable, ({ one }) => ({
  vendor: one(VendorProfileTable, {
    fields: [VendorPaymentTable.vendorId],
    references: [VendorProfileTable.id],
  }),
  plan: one(PlanTable, {
    fields: [VendorPaymentTable.planId],
    references: [PlanTable.id],
  }),
}));
export const userRelations = relations(UserTable, ({ one, many }) => ({
  vendorProfile: one(VendorProfileTable, {
    fields: [UserTable.vendorProfileId],
    references: [VendorProfileTable.id],
  }),
  createdByUser: one(UserTable, {
    fields: [UserTable.createdBy],
    references: [UserTable.id],
  }),
  createdUsers: many(UserTable),
  // Add this new relation
  salesCommissions: many(SalesCommissionTable),
}));

export const vendorProfileRelations = relations(
  VendorProfileTable,
  ({ many, one }) => ({
    user: one(UserTable, {
      fields: [VendorProfileTable.id],
      references: [UserTable.vendorProfileId],
    }),
    vendoruser: one(UserTable, {
      fields: [VendorProfileTable.userId],
      references: [UserTable.id],
    }),
    products: many(VendorProductTable),
    services: many(VendorServiceTable),
    certifications: many(CertificationTable),
    references: many(ReferenceTable),
  })
);

export const serviceCategoryRelations = relations(
  ServiceCategoryTable,
  ({ many }) => ({
    services: many(ServiceTable),
  })
);

export const serviceRelations = relations(ServiceTable, ({ one, many }) => ({
  category: one(ServiceCategoryTable, {
    fields: [ServiceTable.categoryId],
    references: [ServiceCategoryTable.id],
  }),
  vendorServices: many(VendorServiceTable),
}));

export const vendorServiceRelations = relations(
  VendorServiceTable,
  ({ one }) => ({
    vendor: one(VendorProfileTable, {
      fields: [VendorServiceTable.vendorId],
      references: [VendorProfileTable.id],
    }),
    service: one(ServiceTable, {
      fields: [VendorServiceTable.serviceId],
      references: [ServiceTable.id],
    }),
  })
);

export const certificationRelations = relations(
  CertificationTable,
  ({ one }) => ({
    vendor: one(VendorProfileTable, {
      fields: [CertificationTable.vendorId],
      references: [VendorProfileTable.id],
    }),
  })
);

export const referenceRelations = relations(ReferenceTable, ({ one }) => ({
  vendor: one(VendorProfileTable, {
    fields: [ReferenceTable.vendorId],
    references: [VendorProfileTable.id],
  }),
}));

// Add these relations after your existing relations
export const productCategoryRelations = relations(
  ProductCategoryTable,
  ({ many }) => ({
    products: many(ProductTable),
  })
);

export const productRelations = relations(ProductTable, ({ one, many }) => ({
  category: one(ProductCategoryTable, {
    fields: [ProductTable.categoryId],
    references: [ProductCategoryTable.id],
  }),
  vendorProducts: many(VendorProductTable),
}));


export const vendorProductRelations = relations(
  VendorProductTable,
  ({ one }) => ({
    vendor: one(VendorProfileTable, {
      fields: [VendorProductTable.vendorId],
      references: [VendorProfileTable.id],
    }),
    product: one(ProductTable, {
      fields: [VendorProductTable.productId],
      references: [ProductTable.id],
    }),
  })
);
export const salesCommissionRelations = relations(SalesCommissionTable, ({ one }) => ({
  salesPerson: one(UserTable, {
    fields: [SalesCommissionTable.salesPersonId],
    references: [UserTable.id],
  }),
  vendor: one(VendorProfileTable, {
    fields: [SalesCommissionTable.vendorId],
    references: [VendorProfileTable.id],
  }),
  payment: one(VendorPaymentTable, {
    fields: [SalesCommissionTable.paymentId],
    references: [VendorPaymentTable.id],
  }),
  plan: one(PlanTable, {
    fields: [SalesCommissionTable.planId],
    references: [PlanTable.id],
  }),
}));

// Add new relations
export const planRelations = relations(PlanTable, ({ many }) => ({
  vendorPayments: many(VendorPaymentTable),
  salesCommissions: many(SalesCommissionTable),
}));

export const advertisementPlanRelations = relations(AdvertisementPlanTable, ({ one }) => ({
  vendor: one(VendorProfileTable, {
    fields: [AdvertisementPlanTable.vendorId],
    references: [VendorProfileTable.id],
  }),
}));
