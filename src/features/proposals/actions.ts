"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { proposalInputSchema, type ProposalFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createProposal as dsCreate,
  updateProposal as dsUpdate,
  deleteProposal as dsDelete,
  getProposal,
} from "@/lib/data-source/proposals";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createProposalAction(v: ProposalFormValues): Promise<ActionResult> {
  const p = proposalInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const c = await dsCreate(p.data, u.id);
  revalidatePath("/sales/proposals");
  return { ok: true, id: c.id };
}
export async function updateProposalAction(id: string, v: ProposalFormValues): Promise<ActionResult> {
  const p = proposalInputSchema.safeParse(v);
  if (!p.success) return { ok: false, error: "入力に不備があります", fieldErrors: p.error.flatten().fieldErrors };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const up = await dsUpdate(id, p.data, u.id);
  if (!up) return { ok: false, error: "対象が見つかりません" };
  revalidatePath("/sales/proposals"); revalidatePath(`/sales/proposals/${id}`);
  return { ok: true, id };
}
export async function deleteProposalAction(id: string): Promise<void> {
  const u = await getCurrentUser();
  if (u.role === "viewer") throw new Error("削除権限がありません");
  const ok = await dsDelete(id);
  if (!ok) throw new Error("削除対象が見つかりません");
  revalidatePath("/sales/proposals");
  redirect("/sales/proposals");
}

/** 提案構成を丸ごと複製する（要件17：構成全体をコピー） */
export async function duplicateProposalAction(id: string): Promise<ActionResult> {
  const src = await getProposal(id);
  if (!src) return { ok: false, error: "元の提案構成が見つかりません" };
  const u = await getCurrentUser();
  if (u.role === "viewer") return { ok: false, error: "複製権限がありません" };
  const { authorId: _a, updaterId: _u, id: _i, createdAt: _c, updatedAt: _up, ...rest } = src;
  void _a; void _u; void _i; void _c; void _up;
  const copy = await dsCreate(
    { ...rest, name: `${src.name} のコピー` },
    u.id,
  );
  revalidatePath("/sales/proposals");
  return { ok: true, id: copy.id };
}
