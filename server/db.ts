import { eq, desc, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, inquiries, orders, emailLogs, Product, Inquiry, Order, EmailLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// Product queries
// ============================================================

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.category, category as any)).orderBy(desc(products.createdAt));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(
    like(products.nameEn, `%${query}%`)
  ).orderBy(desc(products.createdAt));
}

export async function createProduct(data: any): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  const id = result[0].insertId;
  const product = await getProductById(Number(id));
  if (!product) throw new Error("Failed to create product");
  return product;
}

export async function updateProduct(id: number, data: any): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
  const product = await getProductById(id);
  if (!product) throw new Error("Failed to update product");
  return product;
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// ============================================================
// Inquiry queries
// ============================================================

export async function getAllInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number): Promise<Inquiry | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createInquiry(data: any): Promise<Inquiry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data);
  const id = result[0].insertId;
  const inquiry = await getInquiryById(Number(id));
  if (!inquiry) throw new Error("Failed to create inquiry");
  return inquiry;
}

export async function updateInquiry(id: number, data: any): Promise<Inquiry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set(data).where(eq(inquiries.id, id));
  const inquiry = await getInquiryById(id);
  if (!inquiry) throw new Error("Failed to update inquiry");
  return inquiry;
}

export async function deleteInquiry(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(inquiries).where(eq(inquiries.id, id));
}

// ============================================================
// Order queries
// ============================================================

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(data: any): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  const id = result[0].insertId;
  const order = await getOrderById(Number(id));
  if (!order) throw new Error("Failed to create order");
  return order;
}

export async function updateOrder(id: number, data: any): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(data).where(eq(orders.id, id));
  const order = await getOrderById(id);
  if (!order) throw new Error("Failed to update order");
  return order;
}

// ============================================================
// Email log queries
// ============================================================

export async function createEmailLog(data: any): Promise<EmailLog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(emailLogs).values(data);
  const id = result[0].insertId;
  const log = await db.select().from(emailLogs).where(eq(emailLogs.id, Number(id))).limit(1);
  if (!log || log.length === 0) throw new Error("Failed to create email log");
  return log[0];
}

export async function getEmailLogs(limit: number = 100): Promise<EmailLog[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt)).limit(limit);
}
