"use client";

// 現在のURLに応じて選択メニューを強調するため Client Component。
// 静的なMENU_GROUPS + サーバーから渡される動的メニュー(extraItems) を合成表示。

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MENU_GROUPS } from "@/lib/constants/menu";
import { cn } from "@/lib/utils/cn";
import { SidebarWave } from "./sidebar-wave";
import { CUSTOM_MENU_ICON } from "@/features/custom-menus/icon-map";
import type { CustomMenu } from "@/types/custom-menu";

type Props = {
  onNavigate?: () => void;
  /** 動的メニュー：グループIDごとの追加項目 */
  extraByGroup?: Record<string, CustomMenu[]>;
  /** 現在のユーザーの権限（adminOnly グループのフィルタに使用） */
  userRole?: "admin" | "manager" | "member" | "viewer";
};

export function Sidebar({ onNavigate, extraByGroup = {}, userRole }: Props) {
  // adminOnly なグループは admin 以外には表示しない
  const visibleGroups = MENU_GROUPS.filter(
    (g) => !g.adminOnly || userRole === "admin",
  );
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    visibleGroups.reduce(
      (acc, g) => ({ ...acc, [g.id]: true }),
      {} as Record<string, boolean>,
    ),
  );

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="relative flex h-full w-[260px] shrink-0 flex-col bg-sidebar text-white">
      {/* --- ロゴエリア --- */}
      <div className="flex h-[80px] items-center justify-center border-b border-white/5 px-6">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex flex-col items-center leading-tight"
        >
          <span className="text-2xl font-bold tracking-widest">TELEMO</span>
          <span className="mt-0.5 text-[10px] tracking-[0.25em] text-mint">
            AI SALES AUTOMATION
          </span>
        </Link>
      </div>

      {/* --- メニュー本体 --- */}
      <nav className="thin-scroll relative z-10 flex-1 overflow-y-auto px-3 py-4">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = openGroups[group.id];
          const extras = extraByGroup[group.id] ?? [];

          return (
            <div key={group.id} className="mb-2">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-btn px-3 py-2.5",
                  "text-sm font-semibold text-white/80",
                  "transition-colors hover:bg-sidebar-soft hover:text-white",
                )}
              >
                <span className="flex items-center gap-2">
                  <GroupIcon className="h-4 w-4 text-mint" />
                  {group.label}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-0.5">
                  {/* 基本メニュー */}
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={cn(
                            "group flex items-center gap-2 rounded-btn px-3 py-2.5 text-sm",
                            "transition-colors",
                            isActive
                              ? "bg-mint/20 text-white ring-1 ring-mint/40"
                              : "text-white/70 hover:bg-sidebar-soft hover:text-white",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-mint" : "text-white/60 group-hover:text-white",
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}

                  {/* 動的メニュー（区切り線 + 項目） */}
                  {extras.length > 0 && (
                    <>
                      <li className="my-1 border-t border-white/5" />
                      {extras.map((m) => {
                        const Icon = CUSTOM_MENU_ICON[m.icon];
                        const isActive = pathname === m.href;
                        return (
                          <li key={m.id}>
                            <Link
                              href={m.href}
                              onClick={onNavigate}
                              className={cn(
                                "group flex items-center gap-2 rounded-btn px-3 py-2.5 text-sm",
                                "transition-colors",
                                isActive
                                  ? "bg-mint/20 text-white ring-1 ring-mint/40"
                                  : "text-white/70 hover:bg-sidebar-soft hover:text-white",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  isActive ? "text-mint" : "text-white/60 group-hover:text-white",
                                )}
                              />
                              <span className="truncate">{m.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <SidebarWave />
    </aside>
  );
}
