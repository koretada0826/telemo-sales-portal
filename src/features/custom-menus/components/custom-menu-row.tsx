"use client";

// 動的メニュー1件の行（一覧内で編集モードにも切り替え可能）

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CustomMenu } from "@/types/custom-menu";
import { CUSTOM_MENU_ICON } from "../icon-map";
import { CustomMenuForm } from "./custom-menu-form";
import { deleteCustomMenuAction } from "../actions";

const GROUP_LABEL: Record<string, string> = { training: "研修", sales: "営業", personal: "個人" };

export function CustomMenuRow({ menu }: { menu: CustomMenu }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const Icon = CUSTOM_MENU_ICON[menu.icon];

  const handleDelete = () => {
    if (!confirm(`「${menu.name}」を削除しますか？`)) return;
    startTransition(async () => {
      const r = await deleteCustomMenuAction(menu.id);
      if (r.ok) {
        toast.success("削除しました");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  if (editing) {
    return (
      <CustomMenuForm
        menuId={menu.id}
        defaultValues={{
          name: menu.name, icon: menu.icon, href: menu.href,
          group: menu.group, order: menu.order,
          isPublished: menu.isPublished, viewableRoles: menu.viewableRoles,
        }}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-btn border border-line p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-softer text-mint-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{menu.name}</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {menu.href} ・ 順序 {menu.order}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="gray">{GROUP_LABEL[menu.group]}</Badge>
        <Badge variant={menu.isPublished ? "success" : "warning"}>
          {menu.isPublished ? "公開" : "非公開"}
        </Badge>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} aria-label="編集">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending} aria-label="削除">
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>
    </div>
  );
}
