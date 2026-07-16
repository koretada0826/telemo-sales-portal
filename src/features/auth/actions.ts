"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "@/lib/auth/schema";
import { findUserByEmail, createUser } from "@/lib/auth/user-store";
import { verifyPassword } from "@/lib/auth/hash";
import { createSession, destroySession } from "@/lib/auth/session";

export type AuthResult = { ok: true } | { ok: false; error: string };

/** ログイン */
export async function loginAction(values: LoginValues): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };

  const user = await findUserByEmail(parsed.data.email);
  // ★セキュリティ：ユーザー不在時とパスワード不一致で違うエラーを返さない（メール存在の推測防止）
  if (!user) return { ok: false, error: "メールアドレスまたはパスワードが違います" };

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return { ok: false, error: "メールアドレスまたはパスワードが違います" };

  await createSession(user.id);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** 新規登録 */
export async function registerAction(values: RegisterValues): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, error: first ?? "入力に不備があります" };
  }

  try {
    const user = await createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      department: parsed.data.department,
      role: "member", // 新規登録はメンバー権限固定（管理者は既存adminが昇格させる）
      password: parsed.data.password,
    });
    await createSession(user.id);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "登録に失敗しました" };
  }
}

/** ログアウト */
export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/login");
}
