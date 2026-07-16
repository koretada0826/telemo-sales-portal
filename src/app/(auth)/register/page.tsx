import { redirect } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSessionUserId } from "@/lib/auth/session";

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/dashboard");
  return <RegisterForm />;
}
