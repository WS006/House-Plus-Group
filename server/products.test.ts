import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import * as db from "./db";

describe("Products API", () => {
  // Mock database functions
  beforeAll(() => {
    vi.mock("./db", () => ({
      getAllProducts: vi.fn(),
      getProductById: vi.fn(),
      getProductsByCategory: vi.fn(),
      searchProducts: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return an empty array when no products exist", async () => {
      vi.mocked(db.getAllProducts).mockResolvedValue([]);
      const products = await db.getAllProducts();
      expect(products).toEqual([]);
    });

    it("should return products ordered by creation date", async () => {
      const mockProducts = [
        {
          id: 1,
          nameEn: "Solar Panel",
          nameCn: "太阳能面板",
          descEn: "High efficiency solar panel",
          descCn: "高效太阳能面板",
          category: "solar" as const,
          image: "https://example.com/solar.jpg",
          moq: "100",
          delivery: "30 days",
          price: "$100",
          specs: { power: "300W" },
          isHot: true,
          isNew: false,
          createdAt: new Date("2026-03-20"),
          updatedAt: new Date("2026-03-20"),
        },
      ];
      vi.mocked(db.getAllProducts).mockResolvedValue(mockProducts);
      const products = await db.getAllProducts();
      expect(products).toHaveLength(1);
      expect(products[0].nameEn).toBe("Solar Panel");
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct = {
        id: 1,
        nameEn: "Solar Panel",
        nameCn: "太阳能面板",
        descEn: "High efficiency solar panel",
        descCn: "高效太阳能面板",
        category: "solar" as const,
        image: "https://example.com/solar.jpg",
        moq: "100",
        delivery: "30 days",
        price: "$100",
        specs: { power: "300W" },
        isHot: true,
        isNew: false,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-20"),
      };
      vi.mocked(db.getProductById).mockResolvedValue(mockProduct);
      const product = await db.getProductById(1);
      expect(product).toEqual(mockProduct);
      expect(product?.nameEn).toBe("Solar Panel");
    });

    it("should return undefined for non-existent product", async () => {
      vi.mocked(db.getProductById).mockResolvedValue(undefined);
      const product = await db.getProductById(999);
      expect(product).toBeUndefined();
    });
  });

  describe("getProductsByCategory", () => {
    it("should return products by category", async () => {
      const mockProducts = [
        {
          id: 1,
          nameEn: "Solar Panel",
          nameCn: "太阳能面板",
          descEn: "High efficiency solar panel",
          descCn: "高效太阳能面板",
          category: "solar" as const,
          image: "https://example.com/solar.jpg",
          moq: "100",
          delivery: "30 days",
          price: "$100",
          specs: { power: "300W" },
          isHot: true,
          isNew: false,
          createdAt: new Date("2026-03-20"),
          updatedAt: new Date("2026-03-20"),
        },
      ];
      vi.mocked(db.getProductsByCategory).mockResolvedValue(mockProducts);
      const products = await db.getProductsByCategory("solar");
      expect(products).toHaveLength(1);
      expect(products[0].category).toBe("solar");
    });

    it("should return empty array for category with no products", async () => {
      vi.mocked(db.getProductsByCategory).mockResolvedValue([]);
      const products = await db.getProductsByCategory("nonexistent");
      expect(products).toEqual([]);
    });
  });

  describe("searchProducts", () => {
    it("should search products by name", async () => {
      const mockProducts = [
        {
          id: 1,
          nameEn: "Solar Panel",
          nameCn: "太阳能面板",
          descEn: "High efficiency solar panel",
          descCn: "高效太阳能面板",
          category: "solar" as const,
          image: "https://example.com/solar.jpg",
          moq: "100",
          delivery: "30 days",
          price: "$100",
          specs: { power: "300W" },
          isHot: true,
          isNew: false,
          createdAt: new Date("2026-03-20"),
          updatedAt: new Date("2026-03-20"),
        },
      ];
      vi.mocked(db.searchProducts).mockResolvedValue(mockProducts);
      const products = await db.searchProducts("Solar");
      expect(products).toHaveLength(1);
      expect(products[0].nameEn).toContain("Solar");
    });

    it("should return empty array for no search results", async () => {
      vi.mocked(db.searchProducts).mockResolvedValue([]);
      const products = await db.searchProducts("xyz");
      expect(products).toEqual([]);
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProduct = {
        id: 1,
        nameEn: "Solar Panel",
        nameCn: "太阳能面板",
        descEn: "High efficiency solar panel",
        descCn: "高效太阳能面板",
        category: "solar" as const,
        image: "https://example.com/solar.jpg",
        moq: "100",
        delivery: "30 days",
        price: "$100",
        specs: { power: "300W" },
        isHot: true,
        isNew: false,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-20"),
      };
      vi.mocked(db.createProduct).mockResolvedValue(newProduct);
      const product = await db.createProduct({
        nameEn: "Solar Panel",
        category: "solar",
      });
      expect(product.nameEn).toBe("Solar Panel");
      expect(product.category).toBe("solar");
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", async () => {
      const updatedProduct = {
        id: 1,
        nameEn: "Updated Solar Panel",
        nameCn: "太阳能面板",
        descEn: "High efficiency solar panel",
        descCn: "高效太阳能面板",
        category: "solar" as const,
        image: "https://example.com/solar.jpg",
        moq: "100",
        delivery: "30 days",
        price: "$100",
        specs: { power: "300W" },
        isHot: true,
        isNew: false,
        createdAt: new Date("2026-03-20"),
        updatedAt: new Date("2026-03-21"),
      };
      vi.mocked(db.updateProduct).mockResolvedValue(updatedProduct);
      const product = await db.updateProduct(1, { nameEn: "Updated Solar Panel" });
      expect(product.nameEn).toBe("Updated Solar Panel");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      vi.mocked(db.deleteProduct).mockResolvedValue(undefined);
      await expect(db.deleteProduct(1)).resolves.toBeUndefined();
    });
  });
});
