// 画面上部の固定ヘッダー（Server Component）。
// ハンバーガー / 横断検索 / 通知ベル / ユーザーメニュー の4部品を合成。

import { Suspense } from "react";
import { MobileDrawer } from "./mobile-drawer";
import { HeaderSearch } from "./header-search";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";
import type { CurrentUser } from "@/lib/current-user";
import type { CustomMenu } from "@/types/custom-menu";
import { cn } from "@/lib/utils/cn";

type Props = {
  user: CurrentUser;
  extraByGroup?: Record<string, CustomMenu[]>;
};

export function Header({ user, extraByGroup }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-line bg-white px-4 lg:px-8",
      )}
    >
      <MobileDrawer extraByGroup={extraByGroup} />
      <div className="flex flex-1 justify-center">
        {/* HeaderSearchはuseSearchParamsを使うため、Suspense境界で囲む
            （静的プリレンダリング時のNext.js要件） */}
        <Suspense fallback={<div className="h-11 w-full max-w-2xl rounded-full bg-bg" />}>
          <HeaderSearch />
        </Suspense>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
