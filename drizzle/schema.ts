import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - stores all product information
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameCn: varchar("nameCn", { length: 255 }),
  descEn: text("descEn"),
  descCn: text("descCn"),
  category: mysqlEnum("category", ["solar", "appliances", "3c"]).notNull(),
  image: text("image"),
  moq: varchar("moq", { length: 100 }),
  delivery: varchar("delivery", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  specs: json("specs"), // JSON array of specifications
  isHot: boolean("isHot").default(false),
  isNew: boolean("isNew").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Inquiries table - stores customer inquiries/leads
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  country: varchar("country", { length: 100 }),
  message: text("message"),
  quantity: varchar("quantity", { length: 100 }),
  language: varchar("language", { length: 10 }).default("en"),
  status: mysqlEnum("status", ["new", "contacted", "quoted", "closed"]).default("new"),
  source: mysqlEnum("source", ["website", "whatsapp", "email"]).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Orders table - stores customer orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  inquiryId: int("inquiryId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  items: json("items"), // JSON array of order items
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
  shippingAddress: text("shippingAddress"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Email logs table - tracks sent emails
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["inquiry_confirmation", "inquiry_response", "order_confirmation", "order_update", "newsletter"]).notNull(),
  relatedId: int("relatedId"), // ID of related inquiry or order
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;
