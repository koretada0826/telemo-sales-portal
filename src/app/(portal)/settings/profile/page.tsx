import { UserCog } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/current-user";

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeader
        title="プロフィール設定"
        description="表示名・所属・アバターの変更ができます。"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-mint" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sidebar text-2xl font-semibold text-white">
              {user.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm text-ink-soft">現在のアバター（イニシャル自動生成）</p>
              <Button variant="secondary" size="sm" className="mt-2" disabled>
                アバターを変更
              </Button>
            </div>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" required>氏名</Label>
              <Input id="name" defaultValue={user.name} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス（任意）</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">部署</Label>
              <Input id="department" defaultValue={user.department} disabled />
            </div>
            <Button type="button" disabled>
              保存する
            </Button>
          </form>

          <p className="mt-4 text-xs text-ink-soft">
            ★ プロフィール編集機能は今後追加予定。パスワード変更もここに実装予定です。
          </p>
        </CardContent>
      </Card>
    </>
  );
}
