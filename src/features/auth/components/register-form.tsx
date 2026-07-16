"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterValues } from "@/lib/auth/schema";
import { registerAction } from "@/features/auth/actions";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", department: "", password: "" },
  });

  const onSubmit = (v: RegisterValues) => {
    startTransition(async () => {
      const r = await registerAction(v);
      if (r.ok) {
        toast.success("登録しました。ダッシュボードへ移動します。");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" required>ユーザー名</Label>
            <Input id="name" placeholder="山田 太郎" error={Boolean(errors.name)} {...register("name")} />
            <p className="text-xs text-ink-soft">ログイン時に使う名前です</p>
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">メールアドレス（任意）</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" error={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department">部署</Label>
            <Input id="department" placeholder="営業部" {...register("department")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" required>パスワード</Label>
            <Input id="password" type="password" autoComplete="new-password" error={Boolean(errors.password)} {...register("password")} />
            <p className="text-xs text-ink-soft">4文字以上</p>
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            <UserPlus className="h-4 w-4" />
            {isPending ? "登録中..." : "アカウント作成"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-soft">
          既にアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-mint-dark underline hover:no-underline">
            ログイン
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
