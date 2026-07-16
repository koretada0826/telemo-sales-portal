"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productInputSchema, type ProductFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createProduct as dsCreate,
  updateProduct as dsUpdate,
  deleteProduct as dsDelete,
} from "@/lib/data-source/products";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createProductAction(v: ProductFormValues): Promise<ActionResult> {
  const p = productInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const c = await dsCreate(p.data, u.id);
  revalidatePath("/sales/products");
  revalidatePath("/dashboard");
  return { ok: true, id: c.id };
}
export async function updateProductAction(id: string, v: ProductFormValues): Promise<ActionResult> {
  const p = productInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const up = await dsUpdate(id, p.data, u.id);
  if (!up) return { ok: false, error: "対象が見つかりません" };
  revalidatePath("/sales/products"); revalidatePath(`/sales/products/${id}`);
  return { ok: true, id };
}
export async function deleteProductAction(id: string): Promise<void> {
  const u = await getCurrentUser();
  if (u.role === "viewer") throw new Error("削除権限がありません");
  const ok = await dsDelete(id);
  if (!ok) throw new Error("削除対象が見つかりません");
  revalidatePath("/sales/products"); revalidatePath("/dashboard");
  redirect("/sales/products");
}
