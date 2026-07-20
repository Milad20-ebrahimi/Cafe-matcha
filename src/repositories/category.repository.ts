import { db } from "@/db";
import {  categories } from "@/db/schema";
import {  eq } from "drizzle-orm";
import type { CategoryDTO } from "@/types";

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

export async function findAll(type?: "menu" | "shop") {
  const rows = await db
    .select()
    .from(categories)
    .where(type ? eq(categories.type, type) : undefined)
    .orderBy(categories.sortOrder);
  return rows.map(toCategoryDTO);
}
