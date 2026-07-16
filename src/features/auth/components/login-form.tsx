"use client";

// ログインフォーム。Server Actionを呼び、成功したらダッシュボードへ遷移。

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/lib/auth/schema";
import { loginAction } from "@/features/auth/actions";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (v: LoginValues) => {
    startTransition(async () => {
      const r = await loginAction(v);
      if (r.ok) {
        toast.success("ログインしました");
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
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" required>メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" required>パスワード</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            <LogIn className="h-4 w-4" />
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-soft">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-mint-dark underline hover:no-underline">
            新規登録
          </Link>
        </p>

        {/* 開発用：既存デモアカウント情報 */}
        <div className="mt-6 rounded-btn border border-line bg-bg p-3 text-xs">
          <p className="font-semibold text-ink">デモアカウント</p>
          <p className="mt-1 text-ink-soft">
            メール：<code className="text-mint-dark">yamada@example.com</code>（管理者）
          </p>
          <p className="text-ink-soft">
            パスワード：<code className="text-mint-dark">telemo2026</code>
          </p>
          <p className="mt-1 text-ink-soft">
            他：sato / suzuki / tanaka / ito @example.com（パスワード共通）
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
