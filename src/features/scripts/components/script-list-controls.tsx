"use client";

// スクリプト一覧の検索・シーン絞込・並び替えUI。URLクエリに反映。

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SCRIPT_SCENE_LABEL } from "@/types/script";

export function ScriptListControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const scene = searchParams.get("scene") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const update = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px_180px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <Input
          type="search"
          placeholder="スクリプト名・トーク内容を検索"
          defaultValue={q}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && update("q", (e.target as HTMLInputElement).value)}
          onBlur={(e) => update("q", e.target.value)}
          disabled={isPending}
        />
      </div>
      <Select value={scene} onChange={(e) => update("scene", e.target.value)} disabled={isPending}>
        <option value="">すべてのシーン</option>
        {Object.entries(SCRIPT_SCENE_LABEL).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </Select>
      <Select value={sort} onChange={(e) => update("sort", e.target.value)} disabled={isPending}>
        <option value="newest">更新が新しい順</option>
        <option value="oldest">作成が古い順</option>
      </Select>
    </div>
  );
}
