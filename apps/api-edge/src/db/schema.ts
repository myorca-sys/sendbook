import { pgTable, text, integer, timestamp, boolean, uuid, jsonb, index } from "drizzle-orm/pg-core";

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: text("owner_id").notNull().unique(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    address: text("address"),
    whatsapp: text("whatsapp").notNull(),
    mapsUrl: text("maps_url"),
    theme: jsonb("theme").$type<{ primary: string; accent: string }>().default({ primary: "#6366f1", accent: "#f59e0b" }),
    socialLinks: jsonb("social_links").$type<{ platform: string; url: string }[]>().default([]),
    paymentMethods: jsonb("payment_methods").$type<{ type: "qris" | "bank_transfer" | "e_wallet"; label: string; value: string }[]>().default([]),
    isPublished: boolean("is_published").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    slugIdx: index("stores_slug_idx").on(table.slug),
    ownerIdx: index("stores_owner_idx").on(table.ownerId),
  }),
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    description: text("description"),
    images: text("images").array().notNull().default([]),
    category: text("category"),
    isAvailable: boolean("is_available").default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    storeIdx: index("products_store_idx").on(table.storeId),
  }),
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    type: text("type").$type<"visit" | "whatsapp_click">().notNull(),
    productId: uuid("product_id"),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    storeCreatedIdx: index("analytics_store_created_idx").on(table.storeId, table.createdAt),
  }),
);
