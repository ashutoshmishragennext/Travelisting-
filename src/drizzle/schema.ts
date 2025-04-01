import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  json,
  jsonb,
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
  "TRAVEL_AGENT",
  "HOTEL_ADMIN",
  
]);

export const DealStatus = pgEnum("deal_status", [
  "PENDING",
  "NEGOTIATING",
  "APPROVED",
  "REJECTED",
  "COMPLETED"
]);

export const PropertyType = pgEnum("property_type", [
  "HOTEL",
  "RESORT",
  "HOMESTAY",
  "VILLA",
  "HOSTEL"
]);

export const DealType = pgEnum("deal_type", [
  "FLIGHT",
  "HOTEL",
  "PACKAGE",
  "CRUISE",
  "OTHER"
]);

export const TravelType = pgEnum("travel_type", [
  "DOMESTIC",
  "INTERNATIONAL"
]);

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
    vendorProfileId: uuid("vendor_profile_id").references(
      () => VendorProfileTable.id
    ),
    emailVerifToken: varchar("email_verif_token", { length: 255 }),
    password: varchar("password", { length: 255 }).notNull(),
    mobile: text("mobile"),
    role: UserRole("role").default("TRAVEL_AGENT").notNull(),
    profilePic: text("profile_pic"),
    companyName: varchar("company_name", { length: 200 }),
    gstNumber: varchar("gst_number", { length: 50 }),
    specializations: text("specializations").array(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailKey: uniqueIndex("users_email_key").on(table.email),
    nameEmailIdx: index("users_name_email_idx").on(table.name, table.email),
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

// Property Table
export const PropertyTable = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  propertyType: PropertyType("property_type").notNull(),
  category: varchar("category", { length: 50 }), // Luxury, Budget, etc.
  subcategory: varchar("subcategory", { length: 50 }), // Resort, City Hotel, etc.
  starRating: integer("star_rating"),
  chainId: uuid("chain_id").references(() => HotelChainTable.id),
  
  address: text("address"),
  state: text("state"),
  city: text("city"),
  pincode: varchar("pincode", { length: 20 }),
  
  contactName: varchar("contact_name", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  
  amenities: json("amenities"),
  photos: json("photos"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Hotel Chains Table
export const HotelChainTable = pgTable("hotel_chains", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  websiteUrl: text("website_url"),
  headquarters: text("headquarters"),
  properties: integer("properties_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const DealTypeDefinitionTable = pgTable(
  "deal_type_definitions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(), // e.g., "Flight", "Hotel", "Cab", "Package"
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => UserTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  // (table) => [
  //   uniqueIndex("deal_type_definitions_name_key").on(table.name),
  // ]
);

// ===== DEAL TYPE METADATA SCHEMA =====
export const DealTypeMetadataTable = pgTable(
  "deal_type_metadata",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    dealTypeId: uuid("deal_type_id")
      .references(() => DealTypeDefinitionTable.id, { onDelete: "cascade" })
      .notNull(),
    // The schema defines what metadata fields are required for this deal type
    schema: jsonb("schema").notNull(),
    // version: text("version").default("1.0"),
    isActive: boolean("is_active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => UserTable.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  // (table) => [
  //   index("deal_type_metadata_deal_type_idx").on(table.dealTypeId),
  // ]
);

// Modify the existing DealTable to use the dynamic metadata approach
export const DealTable = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  dealType: DealType("deal_type").notNull(),
  travelType: TravelType("travel_type").notNull(),
  
  // Travel agent who created the deal
  travelAgentId: uuid("travel_agent_id")
    .notNull()
    .references(() => UserTable.id),
    
  // Optional reference to a property (for hotel deals)
  propertyId: uuid("property_id").references(() => PropertyTable.id),
  
  // Common fields
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  images: json("images"), // Array of image URLs
  
  // Contact information (can override travel agent defaults)
  contactPhones: text("contact_phones").array(),
  contactEmails: text("contact_emails").array(),
  
  // Reference to the deal type definition
  dealTypeDefinitionId: uuid("deal_type_definition_id")
    .references(() => DealTypeDefinitionTable.id),
  
  // Dynamic metadata content based on the schema defined in DealTypeMetadataTable
  metadata: jsonb("metadata"),
  
  // Keep the original fields for backward compatibility
  flightDetails: json("flight_details"), // For source, destination, airlines, etc.
  hotelDetails: json("hotel_details"), // For additional hotel details not in property table
  
  // Rich text content with formatting (stored as JSON)
  formattedContent: json("formatted_content"),
  
  // Location details (for both flight destinations and hotels)
  country: varchar("country", { length: 100 }),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Validity dates
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to").notNull(),
  
  // Status and visibility
  isActive: boolean("is_active").default(true).notNull(),
  isPromoted: boolean("is_promoted").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



// Travel Agent Deals Table (existing table - unchanged)
export const TravelAgentDealTable = pgTable("travel_agent_deals", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  travelAgentId: uuid("travel_agent_id")
    .notNull()
    .references(() => UserTable.id),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => PropertyTable.id),
  
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  status: DealStatus("status").default("PENDING").notNull(),
  
  validFrom: date("valid_from"),
  validTo: date("valid_to"),
  
  specialRates: json("special_rates"),
  specialConditions: text("special_conditions"),
  
  roomTypes: json("room_types"),
  discountDetails: json("discount_details"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Communication Log Table
export const CommunicationLogTable = pgTable("communication_logs", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  dealId: uuid("deal_id")
    .notNull()
    .references(() => TravelAgentDealTable.id),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => UserTable.id),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => UserTable.id),
  
  messageType: varchar("message_type", { length: 50 }), // EMAIL, CHAT, CALL, etc.
  message: text("message"),
  
  attachments: json("attachments"),
  readStatus: boolean("read_status").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

// =====================
// Relations
// =====================

export const userRelations = relations(UserTable, ({ many }) => ({
  deals: many(TravelAgentDealTable),
  dynamicDeals: many(DealTable),
  sentMessages: many(CommunicationLogTable, {
    relationName: "sentMessages"
  }),
  receivedMessages: many(CommunicationLogTable, {
    relationName: "receivedMessages"
  }),
}));

export const propertyRelations = relations(PropertyTable, ({ one, many }) => ({
  chain: one(HotelChainTable, {
    fields: [PropertyTable.chainId],
    references: [HotelChainTable.id],
  }),
  deals: many(TravelAgentDealTable),
  dynamicDeals: many(DealTable),
}));

export const hotelChainRelations = relations(HotelChainTable, ({ many }) => ({
  properties: many(PropertyTable),
}));

export const travelAgentDealRelations = relations(
  TravelAgentDealTable,
  ({ one, many }) => ({
    travelAgent: one(UserTable, {
      fields: [TravelAgentDealTable.travelAgentId],
      references: [UserTable.id],
    }),
    property: one(PropertyTable, {
      fields: [TravelAgentDealTable.propertyId],
      references: [PropertyTable.id],
    }),
    communications: many(CommunicationLogTable),
  })
);

export const communicationLogRelations = relations(
  CommunicationLogTable,
  ({ one }) => ({
    deal: one(TravelAgentDealTable, {
      fields: [CommunicationLogTable.dealId],
      references: [TravelAgentDealTable.id],
    }),
    sender: one(UserTable, {
      fields: [CommunicationLogTable.senderId],
      references: [UserTable.id],
      relationName: "sentMessages"
    }),
    receiver: one(UserTable, {
      fields: [CommunicationLogTable.receiverId],
      references: [UserTable.id],
      relationName: "receivedMessages"
    }),
  })
);



// Add the relations for the new tables
export const dealTypeDefinitionRelations = relations(
  DealTypeDefinitionTable,
  ({ many }) => ({
    metadataSchemas: many(DealTypeMetadataTable),
    deals: many(DealTable),
  })
);

export const dealTypeMetadataRelations = relations(
  DealTypeMetadataTable,
  ({ one }) => ({
    dealType: one(DealTypeDefinitionTable, {
      fields: [DealTypeMetadataTable.dealTypeId],
      references: [DealTypeDefinitionTable.id],
    }),
  })
);

// Update the existing dealRelations
export const dealRelations = relations(
  DealTable,
  ({ one }) => ({
    travelAgent: one(UserTable, {
      fields: [DealTable.travelAgentId],
      references: [UserTable.id],
    }),
    property: one(PropertyTable, {
      fields: [DealTable.propertyId],
      references: [PropertyTable.id],
    }),
    dealTypeDefinition: one(DealTypeDefinitionTable, {
      fields: [DealTable.dealTypeDefinitionId],
      references: [DealTypeDefinitionTable.id],
    }),
  })
);