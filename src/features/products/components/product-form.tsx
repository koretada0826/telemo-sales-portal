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
import { productInputSchema, type ProductFormValues } from "../schema";
import { createProductAction, updateProductAction } from "../actions";

type Props = { productId?: string; defaultValues?: Partial<ProductFormValues> };

export function ProductForm({ productId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productInputSchema),
    defaultValues: {
      productName: "", serviceName: "", overview: "", targetCustomer: "",
      targetIndustry: "", customerIssue: "", value: "", features: "",
      strengths: "", pricing: "", implementationFlow: "", competitors: "",
      competitiveAdvantage: "", faq: "", notes: "",
      relatedMaterialIds: [], tagIds: [], visibility: "public",
      ...defaultValues,
    },
  });

  const onSubmit = (v: ProductFormValues) => {
    startTransition(async () => {
      const r = productId ? await updateProductAction(productId, v) : await createProductAction(v);
      if (r.ok) {
        toast.success(productId ? "商品情報を更新しました" : "商品情報を登録しました");
        router.push(r.id ? `/sales/products/${r.id}` : "/sales/products");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  const F = ({ id, label, rows = 3, required, placeholder }: { id: keyof ProductFormValues; label: string; rows?: number; required?: boolean; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} required={required}>{label}</Label>
      <Textarea id={id} rows={rows} placeholder={placeholder} {...register(id as never)} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="productName" required>商品名</Label>
              <Input id="productName" error={Boolean(errors.productName)} {...register("productName")} />
              {errors.productName && <p className="text-xs text-danger">{errors.productName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serviceName">サービス名</Label>
              <Input id="serviceName" {...register("serviceName")} />
            </div>
          </div>
          <F id="overview" label="概要" rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <F id="targetCustomer" label="対象顧客" rows={2} />
            <F id="targetIndustry" label="対象業界" rows={2} />
          </div>
          <F id="customerIssue" label="顧客課題" rows={4} />
          <F id="value" label="提供価値" rows={4} />
          <F id="features" label="機能" rows={4} />
          <F id="strengths" label="特徴" rows={4} />
          <F id="pricing" label="料金" rows={3} />
          <F id="implementationFlow" label="導入までの流れ" rows={3} />
          <div className="grid gap-5 sm:grid-cols-2">
            <F id="competitors" label="競合" rows={2} />
            <F id="competitiveAdvantage" label="競合優位性" rows={2} />
          </div>
          <F id="faq" label="よくある質問" rows={5} />
          <F id="notes" label="注意事項" rows={2} />
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
          <Save className="h-4 w-4" />{isPending ? "保存中..." : productId ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
