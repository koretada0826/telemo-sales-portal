"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { materialInputSchema, type MaterialFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createMaterial as dsCreate,
  updateMaterial as dsUpdate,
  deleteMaterial as dsDelete,
} from "@/lib/data-source/materials";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createMaterialAction(v: MaterialFormValues): Promise<ActionResult> {
  const p = materialInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const c = await dsCreate(p.data, u.id);
  revalidatePath("/sales/materials");
  return { ok: true, id: c.id };
}
export async function updateMaterialAction(id: string, v: MaterialFormValues): Promise<ActionResult> {
  const p = materialInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const up = await dsUpdate(id, p.data, u.id);
  if (!up) return { ok: false, error: "対象が見つかりません" };
  revalidatePath("/sales/materials"); revalidatePath(`/sales/materials/${id}`);
  return { ok: true, id };
}
export async function deleteMaterialAction(id: string): Promise<void> {
  const u = await getCurrentUser();
  if (u.role === "viewer") throw new Error("削除権限がありません");
  const ok = await dsDelete(id);
  if (!ok) throw new Error("削除対象が見つかりません");
  revalidatePath("/sales/materials");
  redirect("/sales/materials");
}
