"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MEETING_STATUS_LABEL } from "@/types/meeting";

export function MeetingListControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const update = (k: string, v: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (v) p.set(k, v); else p.delete(k);
    p.delete("page");
    startTransition(() => router.push(`${pathname}?${p.toString()}`));
  };

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px_180px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <Input
          type="search"
          placeholder="企業名・商談内容を検索"
          defaultValue={q}
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && update("q", (e.target as HTMLInputElement).value)}
          onBlur={(e) => update("q", e.target.value)}
          disabled={isPending}
        />
      </div>
      <Select value={status} onChange={(e) => update("status", e.target.value)} disabled={isPending}>
        <option value="">すべてのステータス</option>
        {Object.entries(MEETING_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
      <Select value={sort} onChange={(e) => update("sort", e.target.value)} disabled={isPending}>
        <option value="newest">商談日時が新しい順</option>
        <option value="oldest">商談日時が古い順</option>
      </Select>
    </div>
  );
}
