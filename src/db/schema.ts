import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- ENUMS ----------
export const productTypeEnum = pgEnum("product_type", ["menu", "shop"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "returned",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "refunded",
]);
export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed"]);

// ---------- ROLES & USERS ----------
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 191 }).notNull().default(""),
  email: varchar("email", { length: 191 }).unique(),
  phone: varchar("phone", { length: 32 }).unique(),
  passwordHash: text("password_hash"),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "set null" }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 191 }).notNull(),
  code: varchar("code", { length: 8 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  consumed: boolean("consumed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 64 }).notNull().default("منزل"),
  receiverName: varchar("receiver_name", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  addressLine: text("address_line").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- CATALOG ----------
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  type: productTypeEnum("type").notNull().default("shop"),
  description: text("description").default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  description: text("description").default(""),
  shortDescription: text("short_description").default(""),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  type: productTypeEnum("type").notNull().default("shop"),
  price: numeric("price", { precision: 12, scale: 0 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 0 }),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").notNull().default([]),
  variants: jsonb("variants").notNull().default([]),
  tags: jsonb("tags").notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.8"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- COUPONS ----------
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  type: couponTypeEnum("type").notNull().default("percent"),
  value: numeric("value", { precision: 12, scale: 0 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 0 })
    .notNull()
    .default("0"),
  usageLimit: integer("usage_limit").notNull().default(0),
  usedCount: integer("used_count").notNull().default(0),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- ORDERS ----------
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  status: orderStatusEnum("status").notNull().default("pending_payment"),
  subtotal: numeric("subtotal", { precision: 12, scale: 0 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 0 }).notNull().default("0"),
  shippingCost: numeric("shipping_cost", { precision: 12, scale: 0 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 12, scale: 0 }).notNull(),
  couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  addressId: uuid("address_id").references(() => addresses.id, {
    onDelete: "set null",
  }),
  receiverName: varchar("receiver_name", { length: 191 }),
  receiverPhone: varchar("receiver_phone", { length: 32 }),
  shippingSnapshot: jsonb("shipping_snapshot").default({}),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: varchar("product_name", { length: 191 }).notNull(),
  productImage: text("product_image"),
  variantLabel: varchar("variant_label", { length: 191 }).default(""),
  unitPrice: numeric("unit_price", { precision: 12, scale: 0 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  total: numeric("total", { precision: 12, scale: 0 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- PAYMENTS ----------
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 64 }).notNull().default("sandbox"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  amount: numeric("amount", { precision: 12, scale: 0 }).notNull(),
  authority: varchar("authority", { length: 191 }),
  refId: varchar("ref_id", { length: 191 }),
  paidAt: timestamp("paid_at"),
  rawResponse: jsonb("raw_response").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- BLOG ----------
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  excerpt: text("excerpt").default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image"),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  tags: jsonb("tags").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- AUDIT LOG ----------
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").references(() => users.id, { onDelete: "set null" }),
  adminName: varchar("admin_name", { length: 191 }).default(""),
  action: varchar("action", { length: 128 }).notNull(),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: varchar("entity_id", { length: 191 }).default(""),
  details: jsonb("details").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- SITE SETTINGS ----------
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  value: jsonb("value").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- RELATIONS ----------
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  addresses: many(addresses),
  orders: many(orders),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  address: one(addresses, { fields: [orders.addressId], references: [addresses.id] }),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, { fields: [blogPosts.authorId], references: [users.id] }),
}));
