"use client";

// 未回答FAQに回答を追記するボタン + モーダル。
// カード上・詳細ページ上どちらでも使える。

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { faqAnswerOnlySchema, type FaqAnswerOnlyValues } from "../schema";
import { answerFaqAction } from "../actions";

type Props = {
  faqId: string;
  question: string;
  /** ボタン見た目のバリアント（カード用は outline、詳細ページ用は primary） */
  variant?: "primary" | "outline";
  /** ボタン内の表示テキスト */
  label?: string;
};

export function AnswerFaqButton({ faqId, question, variant = "outline", label = "答える" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<FaqAnswerOnlyValues>({
    resolver: zodResolver(faqAnswerOnlySchema),
    defaultValues: { answer: "" },
  });

  const onSubmit = (v: FaqAnswerOnlyValues) => {
    startTransition(async () => {
      const r = await answerFaqAction(faqId, v);
      if (r.ok) {
        toast.success("回答を投稿しました");
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)}>
        <MessageSquarePlus className="h-4 w-4" />
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>この質問に回答する</DialogTitle>
            <DialogDescription>
              下の質問に対する回答を入力してください。
            </DialogDescription>
          </DialogHeader>

          {/* 対象の質問を表示 */}
          <div className="rounded-btn bg-mint-softer p-3 text-sm text-ink">
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-mint-soft text-xs font-bold text-mint-dark">
              Q
            </span>
            {question}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`answer-${faqId}`} required>回答</Label>
              <Textarea
                id={`answer-${faqId}`}
                rows={6}
                placeholder="回答内容を入力してください。改行で段落を分けられます。"
                error={Boolean(errors.answer)}
                {...register("answer")}
              />
              {errors.answer && (
                <p className="text-xs text-danger">{errors.answer.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button" variant="secondary"
                onClick={() => setOpen(false)} disabled={isPending}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "投稿中..." : "回答を投稿"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
