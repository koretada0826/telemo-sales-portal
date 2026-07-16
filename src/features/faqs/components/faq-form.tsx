"use client";

// FAQ新規/編集フォーム。
// React Hook Form + Zod でクライアント検証、
// submit時にServer Actionを呼び、結果に応じてトースト表示・リダイレクト。

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { faqInputSchema, type FaqFormValues } from "../schema";
import { FAQ_CATEGORIES } from "@/data/mock/categories";
import { TAGS } from "@/data/mock/tags";
import { createFaqAction, updateFaqAction } from "../actions";

type Props = {
  /** 編集モードなら既存FAQのIDと初期値を受け取る */
  faqId?: string;
  defaultValues?: Partial<FaqFormValues>;
};

/**
 * FAQ フォーム。
 * 新規/編集の両方で使う（faqId が渡されるか否かで挙動が分かれる）。
 */
export function FaqForm({ faqId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqInputSchema),
    defaultValues: {
      question: "",
      answer: "",
      categoryId: null,
      tagIds: [],
      visibility: "public",
      viewableBy: "everyone",
      relatedFaqIds: [],
      ...defaultValues,
    },
  });

  // フォームsubmit：Server Actionを呼び、結果でトースト＋遷移
  const onSubmit = (values: FaqFormValues) => {
    startTransition(async () => {
      const action = faqId
        ? updateFaqAction(faqId, values)
        : createFaqAction(values);
      const result = await action;

      if (result.ok) {
        toast.success(faqId ? "FAQを更新しました" : "FAQを作成しました");
        // 保存後は詳細ページへ移動
        router.push(result.id ? `/knowledge/faqs/${result.id}` : "/knowledge/faqs");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-5">
          {/* 質問 */}
          <div className="space-y-1.5">
            <Label htmlFor="question" required>
              質問
            </Label>
            <Input
              id="question"
              placeholder="例：契約期間中のプラン変更は可能ですか？"
              error={Boolean(errors.question)}
              {...register("question")}
            />
            {errors.question && (
              <p className="text-xs text-danger">{errors.question.message}</p>
            )}
          </div>

          {/* 回答 */}
          <div className="space-y-1.5">
            <Label htmlFor="answer" required>
              回答
            </Label>
            <Textarea
              id="answer"
              rows={10}
              placeholder="回答内容を入力してください。改行で段落を分けられます。"
              error={Boolean(errors.answer)}
              {...register("answer")}
            />
            {errors.answer && (
              <p className="text-xs text-danger">{errors.answer.message}</p>
            )}
          </div>

          {/* カテゴリー */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="categoryId">カテゴリー</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    id="categoryId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  >
                    <option value="">未分類</option>
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* 公開状態 */}
            <div className="space-y-1.5">
              <Label htmlFor="visibility">公開状態</Label>
              <Select id="visibility" {...register("visibility")}>
                <option value="draft">下書き</option>
                <option value="public">公開</option>
                <option value="private">非公開</option>
              </Select>
            </div>
          </div>

          {/* 閲覧権限 */}
          <div className="space-y-1.5">
            <Label htmlFor="viewableBy">閲覧できる権限</Label>
            <Select id="viewableBy" {...register("viewableBy")}>
              <option value="everyone">誰でも閲覧可能</option>
              <option value="member">メンバー以上</option>
              <option value="manager">マネージャー以上</option>
              <option value="admin">管理者のみ</option>
            </Select>
          </div>

          {/* タグ（チェックボックスで複数選択） */}
          <div className="space-y-1.5">
            <Label>タグ</Label>
            <Controller
              control={control}
              name="tagIds"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((t) => {
                    const checked = field.value.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (checked) {
                            field.onChange(field.value.filter((v) => v !== t.id));
                          } else {
                            field.onChange([...field.value, t.id]);
                          }
                        }}
                        className={
                          checked
                            ? "rounded-full border border-mint bg-mint-softer px-3 py-1 text-xs font-medium text-mint-dark"
                            : "rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-soft hover:bg-mint-softer"
                        }
                      >
                        #{t.name}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.tagIds && (
              <p className="text-xs text-danger">{errors.tagIds.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* 保存・キャンセルボタン */}
      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
          キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "保存中..." : faqId ? "更新する" : "作成する"}
        </Button>
      </div>
    </form>
  );
}
