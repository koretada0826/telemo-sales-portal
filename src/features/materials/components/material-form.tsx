"use client";

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
import { materialInputSchema, type MaterialFormValues } from "../schema";
import { createMaterialAction, updateMaterialAction } from "../actions";
import { FILE_KIND_LABEL } from "@/types/material";

type Props = { materialId?: string; defaultValues?: Partial<MaterialFormValues> };

export function MaterialForm({ materialId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialInputSchema),
    defaultValues: {
      name: "", description: "", productId: null, targetIndustry: "",
      scene: "", fileName: "", fileKind: "pdf", fileSizeKb: 0,
      fileUrl: null, thumbnailUrl: null, version: "1.0",
      visibility: "public", tagIds: [],
      ...defaultValues,
    },
  });

  const onSubmit = (v: MaterialFormValues) => {
    startTransition(async () => {
      const r = materialId ? await updateMaterialAction(materialId, v) : await createMaterialAction(v);
      if (r.ok) {
        toast.success(materialId ? "資料情報を更新しました" : "資料情報を登録しました");
        router.push(r.id ? `/sales/materials/${r.id}` : "/sales/materials");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-5">
          <div className="rounded-btn border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
            ⚠ 現状はファイル情報のメタデータ管理のみ。実ファイルのアップロードはフェーズ5でSupabase Storage連携予定です。
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name" required>資料名</Label>
            <Input id="name" error={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">説明</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fileName" required>ファイル名</Label>
              <Input id="fileName" placeholder="例：intro.pdf" error={Boolean(errors.fileName)} {...register("fileName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fileKind">ファイル種別</Label>
              <Select id="fileKind" {...register("fileKind")}>
                {Object.entries(FILE_KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fileSizeKb">サイズ(KB)</Label>
              <Input id="fileSizeKb" type="number" {...register("fileSizeKb")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="version">バージョン</Label>
              <Input id="version" placeholder="1.0" {...register("version")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="targetIndustry">対象業界</Label>
              <Input id="targetIndustry" {...register("targetIndustry")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scene">利用シーン</Label>
              <Input id="scene" placeholder="例：初回商談" {...register("scene")} />
            </div>
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
      </Card>
      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
          <X className="h-4 w-4" />キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />{isPending ? "保存中..." : materialId ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
