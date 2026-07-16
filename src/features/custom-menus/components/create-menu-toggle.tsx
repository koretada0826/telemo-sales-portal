"use client";

// 「+ 新規メニュー」ボタン → クリックでフォーム表示

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomMenuForm } from "./custom-menu-form";

export function CreateMenuToggle() {
  const [open, setOpen] = useState(false);
  if (open) {
    return <CustomMenuForm onDone={() => setOpen(false)} />;
  }
  return (
    <Button onClick={() => setOpen(true)}>
      <Plus className="h-4 w-4" />新規メニュー
    </Button>
  );
}
