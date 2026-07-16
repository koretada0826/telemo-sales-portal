"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { scriptInputSchema, type ScriptFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createScript as dsCreate,
  updateScript as dsUpdate,
  deleteScript as dsDelete,
} from "@/lib/data-source/scripts";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createScriptAction(values: ScriptFormValues): Promise<ActionResult> {
  const parsed = scriptInputSchema.safeParse(values);
  if (!parsed.success)
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const created = await dsCreate(parsed.data, user.id);
  revalidatePath("/training/scripts");
  revalidatePath("/dashboard");
  return { ok: true, id: created.id };
}

export async function updateScriptAction(id: string, values: ScriptFormValues): Promise<ActionResult> {
  const parsed = scriptInputSchema.safeParse(values);
  if (!parsed.success)
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const updated = await dsUpdate(id, parsed.data, user.id);
  if (!updated) return { ok: false, error: "対象が見つかりません" };
  revalidatePath("/training/scripts");
  revalidatePath(`/training/scripts/${id}`);
  return { ok: true, id };
}

export async function deleteScriptAction(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (user.role === "viewer") throw new Error("削除権限がありません");
  const removed = await dsDelete(id);
  if (!removed) throw new Error("削除対象が見つかりません");
  revalidatePath("/training/scripts");
  revalidatePath("/dashboard");
  redirect("/training/scripts");
}
