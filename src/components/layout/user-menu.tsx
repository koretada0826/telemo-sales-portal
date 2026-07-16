"use client";

// ユーザーアバター + ドロップダウンメニュー。Client Component。

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CurrentUser } from "@/lib/current-user";
import { logoutAction } from "@/features/auth/actions";

export function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      // Server Action内のredirectで /login へ遷移する
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 hover:bg-mint-softer"
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-sidebar text-xs font-semibold text-white",
          )}
          aria-hidden="true"
        >
          {user.name.charAt(0)}
        </span>
        <span className="hidden text-sm font-medium text-ink sm:inline">{user.name}</span>
        <ChevronDown className="h-4 w-4 text-ink-soft" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-card border border-line bg-white shadow-card",
            )}
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">{user.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{user.email}</p>
            </div>
            <MenuLink href="/settings/profile" icon={<User className="h-4 w-4" />} label="プロフィール" onClose={() => setOpen(false)} />
            <MenuLink href="/settings/system" icon={<Settings className="h-4 w-4" />} label="アカウント設定" onClose={() => setOpen(false)} />
            <div className="my-1 h-px bg-line" />
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger hover:bg-danger/10 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({
  href, icon, label, onClose,
}: {
  href: string; icon: React.ReactNode; label: string; onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2 px-4 py-2.5 text-left text-sm text-ink hover:bg-mint-softer"
    >
      {icon}
      {label}
    </Link>
  );
}
