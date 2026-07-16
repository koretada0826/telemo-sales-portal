"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { meetingInputSchema, type MeetingFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createMeeting as dsCreate,
  updateMeeting as dsUpdate,
  deleteMeeting as dsDelete,
} from "@/lib/data-source/meetings";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createMeetingAction(v: MeetingFormValues): Promise<ActionResult> {
  const parsed = meetingInputSchema.safeParse(v);
  if (!parsed.success) return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const c = await dsCreate(parsed.data, u.id);
  revalidatePath("/meetings"); revalidatePath("/dashboard");
  return { ok: true, id: c.id };
}

export async function updateMeetingAction(id: string, v: MeetingFormValues): Promise<ActionResult> {
  const parsed = meetingInputSchema.safeParse(v);
  if (!parsed.success) return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const up = await dsUpdate(id, parsed.data);
  if (!up) return { ok: false, error: "対象が見つかりません" };
  revalidatePath("/meetings"); revalidatePath(`/meetings/${id}`);
  return { ok: true, id };
}

export async function deleteMeetingAction(id: string): Promise<void> {
  const u = await getCurrentUser();
  if (u.role === "viewer") throw new Error("削除権限がありません");
  const ok = await dsDelete(id);
  if (!ok) throw new Error("削除対象が見つかりません");
  revalidatePath("/meetings"); revalidatePath("/dashboard");
  redirect("/meetings");
}
