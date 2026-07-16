import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import type { CurrentUser } from "@/lib/current-user";

/**
 * ページの先頭で呼び出し、admin でなければ /dashboard にリダイレクトする。
 * 使用例：
 *   export default async function Page() {
 *     await requireAdmin();
 *     ...
 *   }
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
