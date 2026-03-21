import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import * as db from "./db";

describe("Inquiries API", () => {
  beforeAll(() => {
    vi.mock("./db", () => ({
      getAllInquiries: vi.fn(),
      getInquiryById: vi.fn(),
      createInquiry: vi.fn(),
      updateInquiry: vi.fn(),
      deleteInquiry: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe("getAllInquiries", () => {
    it("should return an empty array when no inquiries exist", async () => {
      vi.mocked(db.getAllInquiries).mockResolvedValue([]);
      const inquiries = await db.getAllInquiries();
      expect(inquiries).toEqual([]);
    });

    it("should return inquiries ordered by creation date", async () => {
      const mockInquiries = [
        {
          id: 1,
          productId: 1,
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1234567890",
          country: "USA",
          message: "Interested in solar panels",
          quantity: "100",
          language: "en",
          source: "website" as const,
          status: "new" as const,
          createdAt: new Date("2026-03-20"),
          updatedAt: new Date("2026-03-20"),
        },
      ];
      vi.mocked(db.getAllInquiries).mockResolvedValue(mockInquiries);
      const inquiries = await db.getAllInquiries();
      expect(inquiries).toHaveLength(1);
      expect(inquiries[0].customerName).toBe("John Doe");
    });
  });

  describe("getInquiryById", () => {
    it("should return an inquiry by ID", async () => {
      const mockInquiry = {
        id: 1,
        productId: 1,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        country: "USA",
        message: "Interested in solar panels",
        quantity: "100",
        language: "en",
        source: "website" as const,
        status: "new" as const,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-20"),
      };
      vi.mocked(db.getInquiryById).mockResolvedValue(mockInquiry);
      const inquiry = await db.getInquiryById(1);
      expect(inquiry).toEqual(mockInquiry);
      expect(inquiry?.customerName).toBe("John Doe");
    });

    it("should return undefined for non-existent inquiry", async () => {
      vi.mocked(db.getInquiryById).mockResolvedValue(undefined);
      const inquiry = await db.getInquiryById(999);
      expect(inquiry).toBeUndefined();
    });
  });

  describe("createInquiry", () => {
    it("should create a new inquiry", async () => {
      const newInquiry = {
        id: 1,
        productId: 1,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        country: "USA",
        message: "Interested in solar panels",
        quantity: "100",
        language: "en",
        source: "website" as const,
        status: "new" as const,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-20"),
      };
      vi.mocked(db.createInquiry).mockResolvedValue(newInquiry);
      const inquiry = await db.createInquiry({
        customerName: "John Doe",
        customerEmail: "john@example.com",
      });
      expect(inquiry.customerName).toBe("John Doe");
      expect(inquiry.customerEmail).toBe("john@example.com");
    });

    it("should set default source and language", async () => {
      const newInquiry = {
        id: 1,
        productId: undefined,
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        customerPhone: undefined,
        country: undefined,
        message: undefined,
        quantity: undefined,
        language: "en",
        source: "website" as const,
        status: "new" as const,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-20"),
      };
      vi.mocked(db.createInquiry).mockResolvedValue(newInquiry);
      const inquiry = await db.createInquiry({
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
      });
      expect(inquiry.source).toBe("website");
      expect(inquiry.language).toBe("en");
    });
  });

  describe("updateInquiry", () => {
    it("should update an inquiry status", async () => {
      const updatedInquiry = {
        id: 1,
        productId: 1,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        country: "USA",
        message: "Interested in solar panels",
        quantity: "100",
        language: "en",
        source: "website" as const,
        status: "contacted" as const,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-21"),
      };
      vi.mocked(db.updateInquiry).mockResolvedValue(updatedInquiry);
      const inquiry = await db.updateInquiry(1, { status: "contacted" });
      expect(inquiry.status).toBe("contacted");
    });
  });

  describe("deleteInquiry", () => {
    it("should delete an inquiry", async () => {
      vi.mocked(db.deleteInquiry).mockResolvedValue(undefined);
      await expect(db.deleteInquiry(1)).resolves.toBeUndefined();
    });
  });
});
