import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import type { ProductDTO, CategoryDTO, ProductVariant } from "@/types";

function toProductDTO(row: typeof products.$inferSelect, categoryName?: string | null, categorySlug?: string | null): ProductDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    shortDescription: row.shortDescription ?? "",
    categoryId: row.categoryId,
    categoryName: categoryName ?? null,
    categorySlug: categorySlug ?? null,
    type: row.type,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
    stock: row.stock,
    images: (row.images as string[]) ?? [],
    variants: (row.variants as ProductVariant[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    isFeatured: row.isFeatured,
    isActive: row.isActive,
    rating: row.rating ? Number(row.rating) : 4.8,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toCategoryDTO(row: typeof categories.$inferSelect): CategoryDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    description: row.description ?? "",
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
  };
}

export async function getCategories(type?: "menu" | "shop") {
  const rows = await db
    .select()
    .from(categories)
    .where(type ? eq(categories.type, type) : undefined)
    .orderBy(categories.sortOrder);
  return rows.map(toCategoryDTO);
}

export async function getProducts(opts: {
  type?: "menu" | "shop";
  categorySlug?: string;
  featured?: boolean;
  onlyActive?: boolean;
} = {}) {
  const conditions = [];
  if (opts.type) conditions.push(eq(products.type, opts.type));
  if (opts.featured) conditions.push(eq(products.isFeatured, true));
  if (opts.onlyActive !== false) conditions.push(eq(products.isActive, true));

  let categoryId: string | undefined;
  if (opts.categorySlug) {
    const [cat] = await db.select().from(categories).where(eq(categories.slug, opts.categorySlug));
    if (!cat) return [];
    categoryId = cat.id;
    conditions.push(eq(products.categoryId, cat.id));
  }

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt));

  return rows.map((r) => toProductDTO(r.product, r.category?.name, r.category?.slug));
}

export async function getProductBySlug(slug: string) {
  const [row] = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));
  if (!row) return null;
  return toProductDTO(row.product, row.category?.name, row.category?.slug);
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, type: "menu" | "shop") {
  if (!categoryId) return [];
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
    .limit(5);
  return rows
    .filter((r) => r.product.id !== excludeId)
    .slice(0, 4)
    .map((r) => toProductDTO(r.product, r.category?.name, r.category?.slug));
}

export const sqlLower = sql;
