import Link from "next/link";
import { UserPlus, Mail, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/lib/auth/user-store";
import { formatDate } from "@/lib/utils/format";

// 権限バッジ色
const ROLE_META: Record<string, { label: string; variant: "success" | "mint" | "gray" | "warning" }> = {
  admin: { label: "管理者", variant: "success" },
  manager: { label: "マネージャー", variant: "mint" },
  member: { label: "メンバー", variant: "gray" },
  viewer: { label: "閲覧のみ", variant: "warning" },
};

export default async function UsersSettingsPage() {
  // ★実データ：JSONファイルから取得
  const users = await listUsers();

  return (
    <>
      <PageHeader
        title="ユーザー管理"
        description="ポータルを利用するユーザーの一覧・登録を管理します。新規はログイン画面から「新規登録」で追加できます。"
        action={
          <Button asChild variant="outline">
            <Link href="/register" target="_blank">
              <UserPlus className="h-4 w-4" />
              新規登録ページを開く
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>登録ユーザー（{users.length}名）</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-line p-0">
          {users.map((u) => {
            const role = ROLE_META[u.role];
            return (
              <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar text-sm font-semibold text-white">
                  {u.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{u.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />{u.email}
                    </span>
                    {u.department && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />{u.department}
                      </span>
                    )}
                    <span>登録：{formatDate(u.createdAt)}</span>
                  </p>
                </div>
                <Badge variant={role.variant}>{role.label}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="mt-4 rounded-btn border border-mint-soft bg-mint-softer p-3 text-xs text-mint-dark">
        ★ 認証は自前実装（JSONファイル + bcryptハッシュ + 署名Cookieセッション）。
        パスワードは全て一方向暗号化して保存されているため、DBが漏れても復元できません。
      </p>
    </>
  );
}
