import { findAll } from "@/repositories/category.repository";

export async function getCategories(
  source?: "menu" | "shop"
) {
  return findAll(source);
}

export async function getMenuCategories() {
  return findAll("menu");
}

export async function getShopCategories() {
  return findAll("shop");
}