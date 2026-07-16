"use client";

/**
 * 汎用の「削除ボタン + 確認ダイアログ」。
 * 各コンテンツの削除Actionを onConfirm に渡すだけで再利用できる。
 */

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  /** 削除対象を説明する短い文（ダイアログに表示） */
  label: string;
  /** 実際にサーバー側で削除するAction。redirectを含むことが多い。 */
  onConfirm: () => Promise<void>;
};

export function ConfirmDeleteButton({ label, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onConfirm();
        toast.success("削除しました");
      } catch (e) {
        // Server Action の redirect() は Error として throw されるので無視
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) return;
        toast.error(e instanceof Error ? e.message : "削除に失敗しました");
      }
    });
  };

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        削除
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除しますか？</DialogTitle>
            <DialogDescription>
              「{label}」を削除します。この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isPending}>
              {isPending ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
