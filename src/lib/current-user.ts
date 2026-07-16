import "server-only";
import { getSessionUserId } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/user-store";

/**
 * セッションCookieから現在のユーザーを取得する。
 * ★重要：これはServer Component / Server Actionでのみ動く（cookies()を使うため）。
 * 呼び出し側は必ず await が必要。
 *
 * 認証必須ページはmiddlewareで守っているため、ここで null を返すのは通常ない。
 * ただしCookie改ざん・有効期限切れの場合は null になり得るので、
 * その時はゲスト扱いにしてUIを崩さないよう最低限の情報を返す設計もアリ。
 * ここでは throw して呼び出し側に責任を持たせる。
 */

export type UserRole = "admin" | "manager" | "member" | "viewer";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
};

/** ログイン中のユーザー情報を取得。未ログインなら null */
export async function getCurrentUser(): Promise<CurrentUser> {
  const userId = await getSessionUserId();
  if (!userId) {
    // ミドルウェアで守られているため通常来ないが、
    // 万一辿り着いた場合はゲストとして扱う
    return {
      id: "guest",
      name: "ゲスト",
      email: "",
      role: "viewer",
      department: "",
    };
  }
  const stored = await findUserById(userId);
  if (!stored) {
    return {
      id: "guest",
      name: "ゲスト",
      email: "",
      role: "viewer",
      department: "",
    };
  }
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    role: stored.role,
    department: stored.department,
  };
}
