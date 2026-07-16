"use client";

// ログインフォーム（名前 + パスワード）

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

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", password: "" },
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
            <Label htmlFor="name" required>ユーザー名</Label>
            <Input
              id="name"
              type="text"
              placeholder="漢字フルネームで空白なしで入力してください"
              autoComplete="username"
              error={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
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
      </CardContent>
    </Card>
  );
}
