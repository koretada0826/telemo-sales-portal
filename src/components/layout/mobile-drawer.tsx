"use client";

// スマホ・タブレット向けの左スライドインドロワー。
// 動的メニューはサーバーから extraByGroup で受け取り、Sidebarに渡す。

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils/cn";
import type { CustomMenu } from "@/types/custom-menu";

type Props = {
  extraByGroup?: Record<string, CustomMenu[]>;
};

export function MobileDrawer({ extraByGroup }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-btn",
          "text-ink hover:bg-mint-softer lg:hidden",
        )}
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              "absolute right-2 top-2 z-10 inline-flex h-8 w-8",
              "items-center justify-center rounded-full",
              "bg-white/10 text-white hover:bg-white/20",
            )}
            aria-label="メニューを閉じる"
          >
            <X className="h-4 w-4" />
          </button>
          <Sidebar onNavigate={() => setOpen(false)} extraByGroup={extraByGroup} />
        </div>
      </div>
    </>
  );
}
