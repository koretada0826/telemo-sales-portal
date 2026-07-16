"use client";

// FAQ削除ボタン。クリックすると確認ダイアログが出て、
// 「削除する」を押すとServer Actionが呼ばれて実際に削除される。

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
import { deleteFaqAction } from "../actions";

type Props = {
  faqId: string;
  question: string;
};

export function FaqDeleteButton({ faqId, question }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteFaqAction(faqId);
        // Server Action内でredirectが呼ばれるためここは通常到達しない
        toast.success("FAQを削除しました");
      } catch (e) {
        // Next.jsのredirect()はエラーとして投げられるので、
        // それ以外の本物のエラーだけトーストで通知する。
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
            <DialogTitle>FAQを削除しますか？</DialogTitle>
            <DialogDescription>
              「{question}」を削除します。この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
