"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save, X, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { proposalInputSchema, type ProposalFormValues } from "../schema";
import { createProposalAction, updateProposalAction } from "../actions";

type Props = { proposalId?: string; defaultValues?: Partial<ProposalFormValues> };

export function ProposalForm({ proposalId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, control, handleSubmit, formState: { errors } } = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalInputSchema),
    defaultValues: {
      name: "", productId: null, targetIndustry: "", targetCustomer: "",
      purpose: "", currentState: "", issue: "", cause: "", solution: "",
      benefit: "", flow: "", pricing: "", closing: "", supplement: "",
      extraSections: [], tagIds: [], visibility: "public",
      ...defaultValues,
    },
  });

  // 追加セクションの配列を管理（追加・削除・並び替え）
  const { fields, append, remove, swap } = useFieldArray({ control, name: "extraSections" });

  const onSubmit = (v: ProposalFormValues) => {
    startTransition(async () => {
      const r = proposalId ? await updateProposalAction(proposalId, v) : await createProposalAction(v);
      if (r.ok) {
        toast.success(proposalId ? "提案構成を更新しました" : "提案構成を登録しました");
        router.push(r.id ? `/sales/proposals/${r.id}` : "/sales/proposals");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  const addSection = () => append({ id: `es-${Date.now()}`, title: "新規セクション", body: "" });

  const F = ({ id, label, rows = 3 }: { id: keyof ProposalFormValues; label: string; rows?: number }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} rows={rows} {...register(id as never)} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" required>構成名</Label>
              <Input id="name" error={Boolean(errors.name)} {...register("name")} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visibility">公開状態</Label>
              <Select id="visibility" {...register("visibility")}>
                <option value="draft">下書き</option>
                <option value="public">公開</option>
                <option value="private">非公開</option>
              </Select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="targetCustomer">対象顧客</Label>
              <Input id="targetCustomer" {...register("targetCustomer")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetIndustry">対象業界</Label>
              <Input id="targetIndustry" {...register("targetIndustry")} />
            </div>
          </div>
          <F id="purpose" label="提案目的" rows={3} />
          <F id="currentState" label="現状整理" rows={3} />
          <F id="issue" label="課題" rows={3} />
          <F id="cause" label="原因" rows={3} />
          <F id="solution" label="解決策" rows={4} />
          <F id="benefit" label="導入メリット" rows={3} />
          <F id="flow" label="導入フロー" rows={3} />
          <F id="pricing" label="料金提示" rows={3} />
          <F id="closing" label="クロージング" rows={2} />
          <F id="supplement" label="補足" rows={2} />
        </div>
      </Card>

      {/* 追加セクション（上下ボタンで並び替え可能） */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">追加セクション</h3>
            <p className="mt-1 text-xs text-ink-soft">
              事例・付録などを自由に追加できます。順序は ↑ ↓ ボタンで変更。
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4" />セクションを追加
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {fields.length === 0 ? (
            <p className="rounded-btn border border-dashed border-line p-4 text-center text-sm text-ink-soft">
              追加セクションはまだありません
            </p>
          ) : (
            fields.map((f, idx) => (
              <div key={f.id} className="rounded-btn border border-line p-4">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder="セクションタイトル"
                    defaultValue={f.title}
                    {...register(`extraSections.${idx}.title`)}
                  />
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => idx > 0 && swap(idx, idx - 1)} disabled={idx === 0} aria-label="上に移動">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => idx < fields.length - 1 && swap(idx, idx + 1)} disabled={idx === fields.length - 1} aria-label="下に移動">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)} aria-label="削除">
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  className="mt-2"
                  rows={3}
                  placeholder="セクション本文"
                  defaultValue={f.body}
                  {...register(`extraSections.${idx}.body`)}
                />
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
          <X className="h-4 w-4" />キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />{isPending ? "保存中..." : proposalId ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
