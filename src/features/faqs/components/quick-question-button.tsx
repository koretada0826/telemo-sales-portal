"use client";

// 質問だけ投稿するクイック投稿ボタン。
// 「回答は誰か答えてね」というQ&Aコミュニティ的な機能。

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { faqQuestionOnlySchema, type FaqQuestionOnlyValues } from "../schema";
import { postQuestionAction } from "../actions";
import { FAQ_CATEGORIES } from "@/data/mock/categories";

export function QuickQuestionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<FaqQuestionOnlyValues>({
    resolver: zodResolver(faqQuestionOnlySchema),
    defaultValues: { question: "", categoryId: null },
  });

  const onSubmit = (v: FaqQuestionOnlyValues) => {
    startTransition(async () => {
      const r = await postQuestionAction({
        question: v.question,
        categoryId: v.categoryId || null,
      });
      if (r.ok) {
        toast.success("質問を投稿しました。誰かの回答を待ちましょう。");
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
      <Button variant="outline" onClick={() => setOpen(true)}>
        <HelpCircle className="h-4 w-4" />
        質問を投稿
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>質問だけ投稿</DialogTitle>
            <DialogDescription>
              回答が分からなくても大丈夫です。投稿後、他のメンバーが回答をつけられます。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="qq-question" required>質問</Label>
              <Textarea
                id="qq-question"
                rows={3}
                placeholder="例：初回商談で確度を見極めるコツは？"
                error={Boolean(errors.question)}
                {...register("question")}
              />
              {errors.question && (
                <p className="text-xs text-danger">{errors.question.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-category">カテゴリー（任意）</Label>
              <Select id="qq-category" {...register("categoryId")}>
                <option value="">未分類</option>
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button" variant="secondary"
                onClick={() => setOpen(false)} disabled={isPending}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "投稿中..." : "投稿する"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
