"use server";

import { revalidatePath } from "next/cache";
import { customMenuSchema, type CustomMenuFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createCustomMenu as dsCreate,
  updateCustomMenu as dsUpdate,
  deleteCustomMenu as dsDelete,
} from "@/lib/data-source/custom-menus";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

/** 動的メニュー操作は管理者(admin)のみ */
async function assertAdmin() {
  const u = await getCurrentUser();
  if (u.role !== "admin") throw new Error("管理者権限が必要です");
  return u;
}

export async function createCustomMenuAction(v: CustomMenuFormValues): Promise<ActionResult> {
  const parsed = customMenuSchema.safeParse(v);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };
  try {
    const u = await assertAdmin();
    const c = await dsCreate(parsed.data, u.id);
    revalidatePath("/settings/menus");
    revalidatePath("/", "layout"); // サイドバー更新のため全レイアウト再取得
    return { ok: true, id: c.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "作成に失敗しました" };
  }
}

export async function updateCustomMenuAction(id: string, v: CustomMenuFormValues): Promise<ActionResult> {
  const parsed = customMenuSchema.safeParse(v);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };
  try {
    await assertAdmin();
    const up = await dsUpdate(id, parsed.data);
    if (!up) return { ok: false, error: "対象が見つかりません" };
    revalidatePath("/settings/menus");
    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "更新に失敗しました" };
  }
}

export async function deleteCustomMenuAction(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    const ok = await dsDelete(id);
    if (!ok) return { ok: false, error: "削除対象が見つかりません" };
    revalidatePath("/settings/menus");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "削除に失敗しました" };
  }
}
