import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================
  // Products API
  // ============================================================
  products: router({
    // Get all products
    list: publicProcedure.query(async () => {
      return db.getAllProducts();
    }),

    // Get product by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }
        return product;
      }),

    // Get products by category
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getProductsByCategory(input.category);
      }),

    // Search products
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return db.searchProducts(input.query);
      }),

    // Create product (admin only)
    create: protectedProcedure
      .input(z.object({
        nameEn: z.string(),
        nameCn: z.string().optional(),
        descEn: z.string().optional(),
        descCn: z.string().optional(),
        category: z.enum(["solar", "appliances", "3c"]),
        image: z.string().optional(),
        moq: z.string().optional(),
        delivery: z.string().optional(),
        price: z.string().optional(),
        specs: z.any().optional(),
        isHot: z.boolean().optional(),
        isNew: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        return db.createProduct(input);
      }),

    // Update product (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        return db.updateProduct(input.id, input.data);
      }),

    // Delete product (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // ============================================================
  // Inquiries API
  // ============================================================
  inquiries: router({
    // Get all inquiries (admin only)
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      return db.getAllInquiries();
    }),

    // Get inquiry by ID (admin only)
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const inquiry = await db.getInquiryById(input.id);
        if (!inquiry) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found" });
        }
        return inquiry;
      }),

    // Create inquiry (public)
    create: publicProcedure
      .input(z.object({
        productId: z.number().optional(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        country: z.string().optional(),
        message: z.string().optional(),
        quantity: z.string().optional(),
        language: z.string().optional(),
        source: z.enum(["website", "whatsapp", "email"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const inquiry = await db.createInquiry({
          ...input,
          source: input.source || "website",
          language: input.language || "en",
        });
        
        // TODO: Send email notification to admin
        // await sendInquiryNotificationEmail(inquiry);
        
        return inquiry;
      }),

    // Update inquiry (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "quoted", "closed"]).optional(),
        data: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const updateData = input.data || {};
        if (input.status) {
          updateData.status = input.status;
        }
        return db.updateInquiry(input.id, updateData);
      }),

    // Delete inquiry (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        await db.deleteInquiry(input.id);
        return { success: true };
      }),
  }),

  // ============================================================
  // Orders API
  // ============================================================
  orders: router({
    // Get all orders (admin only)
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      return db.getAllOrders();
    }),

    // Get order by ID (admin only)
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        return order;
      }),

    // Create order (admin only)
    create: protectedProcedure
      .input(z.object({
        orderNumber: z.string(),
        inquiryId: z.number().optional(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        items: z.any(),
        totalAmount: z.string().optional(),
        shippingAddress: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        return db.createOrder(input);
      }),

    // Update order (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
        data: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
        }
        const updateData = input.data || {};
        if (input.status) {
          updateData.status = input.status;
        }
        return db.updateOrder(input.id, updateData);
      }),
  }),
});

export type AppRouter = typeof appRouter;
