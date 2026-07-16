"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "@/lib/auth/schema";
import { findUserByName, createUser } from "@/lib/auth/user-store";
import { verifyPassword } from "@/lib/auth/hash";
import { createSession, destroySession } from "@/lib/auth/session";

export type AuthResult = { ok: true } | { ok: false; error: string };

/** ログイン（名前 + パスワード） */
export async function loginAction(values: LoginValues): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };

  const user = await findUserByName(parsed.data.name);
  // ★セキュリティ：ユーザー不在/パスワード不一致で同じエラーを返す
  if (!user) return { ok: false, error: "ユーザー名またはパスワードが違います" };

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return { ok: false, error: "ユーザー名またはパスワードが違います" };

  await createSession(user.id);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** 新規登録（管理者による追加用として維持） */
export async function registerAction(values: RegisterValues): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, error: first ?? "入力に不備があります" };
  }

  try {
    const user = await createUser({
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      department: parsed.data.department,
      role: "member",
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
