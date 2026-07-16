import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSessionUserId } from "@/lib/auth/session";

export default async function LoginPage() {
  // 既にログイン済みならダッシュボードへ
  const userId = await getSessionUserId();
  if (userId) redirect("/dashboard");
  return <LoginForm />;
}
