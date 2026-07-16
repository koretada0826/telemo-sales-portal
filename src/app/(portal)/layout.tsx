import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/current-user";
import { listVisibleCustomMenus } from "@/lib/data-source/custom-menus";
import type { CustomMenu } from "@/types/custom-menu";
import type { CustomMenuGroup } from "@/types/custom-menu";

/**
 * ポータル全体の共通レイアウト。
 * サイドバー・ヘッダーには動的メニュー(extraByGroup)を注入する。
 * adminOnly メニューグループは role='admin' 以外には見えないよう、
 * ここでユーザー役割を Sidebar / Header に渡す。
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const visible = await listVisibleCustomMenus(user.role);
  const extraByGroup: Record<string, CustomMenu[]> = { training: [], sales: [], personal: [] };
  for (const m of visible) {
    (extraByGroup[m.group as CustomMenuGroup] ??= []).push(m);
  }

  return (
    <div className="flex h-dvh w-full">
      <div className="hidden lg:block">
        <Sidebar extraByGroup={extraByGroup} userRole={user.role} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} extraByGroup={extraByGroup} />
        <main className="thin-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-content px-4 py-6 sm:px-8 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
