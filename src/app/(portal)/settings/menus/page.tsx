import { ListPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAllCustomMenus } from "@/lib/data-source/custom-menus";
import { requireAdmin } from "@/lib/auth/require-admin";
import { CustomMenuRow } from "@/features/custom-menus/components/custom-menu-row";
import { CreateMenuToggle } from "@/features/custom-menus/components/create-menu-toggle";

export default async function MenusSettingsPage() {
  await requireAdmin();
  const menus = await listAllCustomMenus();

  return (
    <>
      <PageHeader
        title="動的メニュー管理"
        description="サイドバーに独自メニューを追加できます。基本メニュー（FAQ・スクリプト等）は削除できません。"
        action={<CreateMenuToggle />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="h-4 w-4 text-mint" />
            登録済みメニュー（{menus.length}件）
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menus.length === 0 ? (
            <EmptyState icon={ListPlus} title="動的メニューはまだありません" description="右上の「新規メニュー」から追加できます。" />
          ) : (
            <div className="space-y-3">
              {menus.map((m) => <CustomMenuRow key={m.id} menu={m} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
