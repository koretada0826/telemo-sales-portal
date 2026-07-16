"use client";

// トークスクリプト フォーム（新規/編集共用）

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { scriptInputSchema, type ScriptFormValues } from "../schema";
import { createScriptAction, updateScriptAction } from "../actions";
import { SCRIPT_SCENE_LABEL } from "@/types/script";

type Props = {
  scriptId?: string;
  defaultValues?: Partial<ScriptFormValues>;
};

export function ScriptForm({ scriptId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptInputSchema),
    defaultValues: {
      name: "", productId: null, industry: "", scene: "reception",
      opening: "", hearing: "", problemRaise: "", productPitch: "",
      closing: "", objectionHandling: "", notes: "",
      tagIds: [], visibility: "public",
      ...defaultValues,
    },
  });

  const onSubmit = (values: ScriptFormValues) => {
    startTransition(async () => {
      const result = scriptId ? await updateScriptAction(scriptId, values) : await createScriptAction(values);
      if (result.ok) {
        toast.success(scriptId ? "スクリプトを更新しました" : "スクリプトを作成しました");
        router.push(result.id ? `/training/scripts/${result.id}` : "/training/scripts");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" required>スクリプト名</Label>
              <Input id="name" placeholder="例：SaaS新規開拓 - 受付突破" error={Boolean(errors.name)} {...register("name")} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scene" required>利用シーン</Label>
              <Select id="scene" {...register("scene")}>
                {Object.entries(SCRIPT_SCENE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="industry">対象業界</Label>
              <Input id="industry" placeholder="例：IT・SaaS" {...register("industry")} />
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

          {/* セクション別テキスト */}
          <SectionField id="opening" label="冒頭トーク" register={register} rows={3} />
          <SectionField id="hearing" label="ヒアリング項目" register={register} rows={3} />
          <SectionField id="problemRaise" label="課題提起" register={register} rows={3} />
          <SectionField id="productPitch" label="商品説明" register={register} rows={3} />
          <SectionField id="closing" label="クロージング" register={register} rows={3} />
          <SectionField id="objectionHandling" label="反論処理" register={register} rows={3} />
          <SectionField id="notes" label="注意事項" register={register} rows={2} />
        </div>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
          <X className="h-4 w-4" />キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "保存中..." : scriptId ? "更新する" : "作成する"}
        </Button>
      </div>
    </form>
  );
}

// 各テキストセクションの共通部品
function SectionField({
  id, label, register, rows,
}: {
  id: keyof ScriptFormValues;
  label: string;
  register: ReturnType<typeof useForm<ScriptFormValues>>["register"];
  rows: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} rows={rows} {...register(id as never)} />
    </div>
  );
}
