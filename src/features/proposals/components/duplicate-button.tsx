"use client";

// 提案構成を複製するボタン。Server Actionを呼び、成功したら新IDへ遷移。

import { useTransition } from "react";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duplicateProposalAction } from "../actions";

export function DuplicateProposalButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(async () => {
      const r = await duplicateProposalAction(id);
      if (r.ok) {
        toast.success("提案構成を複製しました");
        router.push(`/sales/proposals/${r.id}`);
        router.refresh();
      } else toast.error(r.error);
    });
  };
  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      <Copy className="h-4 w-4" />
      {isPending ? "複製中..." : "構成を複製"}
    </Button>
  );
}
