"use client";

// 動的メニューの新規・編集フォーム（インラインで表示）

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { customMenuSchema, type CustomMenuFormValues } from "../schema";
import { createCustomMenuAction, updateCustomMenuAction } from "../actions";
import { CUSTOM_MENU_ICON_LABEL } from "../icon-map";

const ROLES = ["admin", "manager", "member", "viewer"] as const;
const ROLE_LABEL: Record<(typeof ROLES)[number], string> = {
  admin: "管理者", manager: "マネージャー", member: "メンバー", viewer: "閲覧のみ",
};

type Props = {
  menuId?: string;
  defaultValues?: Partial<CustomMenuFormValues>;
  onDone?: () => void;
};

export function CustomMenuForm({ menuId, defaultValues, onDone }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, control, handleSubmit, formState: { errors } } = useForm<CustomMenuFormValues>({
    resolver: zodResolver(customMenuSchema),
    defaultValues: {
      name: "", icon: "star", href: "/",
      group: "training", order: 100,
      isPublished: true, viewableRoles: ["admin", "manager", "member"],
      ...defaultValues,
    },
  });

  const onSubmit = (v: CustomMenuFormValues) => {
    startTransition(async () => {
      const r = menuId ? await updateCustomMenuAction(menuId, v) : await createCustomMenuAction(v);
      if (r.ok) {
        toast.success(menuId ? "メニューを更新しました" : "メニューを追加しました");
        onDone?.();
        router.refresh();
      } else toast.error(r.error);
    });
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cm-name" required>メニュー名</Label>
            <Input id="cm-name" error={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cm-icon">アイコン</Label>
            <Select id="cm-icon" {...register("icon")}>
              {Object.entries(CUSTOM_MENU_ICON_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cm-href" required>遷移先URL</Label>
          <Input id="cm-href" placeholder="例：/knowledge/faqs?categoryId=..." {...register("href")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="cm-group">所属大分類</Label>
            <Select id="cm-group" {...register("group")}>
              <option value="personal">個人</option>
              <option value="training">研修</option>
              <option value="sales">営業</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cm-order">表示順（小さいほど上）</Label>
            <Input id="cm-order" type="number" {...register("order")} />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input id="cm-published" type="checkbox" defaultChecked className="h-4 w-4 accent-mint" {...register("isPublished")} />
            <Label htmlFor="cm-published">公開する</Label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>閲覧可能なロール</Label>
          <Controller
            control={control}
            name="viewableRoles"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => {
                  const checked = field.value.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        field.onChange(
                          checked ? field.value.filter((v) => v !== r) : [...field.value, r],
                        );
                      }}
                      className={
                        checked
                          ? "rounded-full border border-mint bg-mint-softer px-3 py-1 text-xs font-medium text-mint-dark"
                          : "rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-soft hover:bg-mint-softer"
                      }
                    >
                      {ROLE_LABEL[r]}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.viewableRoles && <p className="text-xs text-danger">{errors.viewableRoles.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          {onDone && (
            <Button type="button" variant="secondary" size="sm" onClick={onDone} disabled={isPending}>
              <X className="h-4 w-4" />キャンセル
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isPending}>
            <Save className="h-4 w-4" />{isPending ? "保存中..." : menuId ? "更新" : "追加"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
