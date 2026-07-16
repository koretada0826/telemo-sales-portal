import Link from "next/link";
import {
  Search, BookOpen, MessageSquareText, Handshake,
  Package, FileText, LayoutList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { crossSearch, type SearchResultType } from "@/lib/data-source/search";
import { formatRelative } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const TYPE_META: Record<SearchResultType, { label: string; icon: LucideIcon; color: string }> = {
  faq: { label: "FAQ", icon: BookOpen, color: "text-mint-dark" },
  script: { label: "スクリプト", icon: MessageSquareText, color: "text-mint-dark" },
  meeting: { label: "商談", icon: Handshake, color: "text-success" },
  product: { label: "商品", icon: Package, color: "text-mint" },
  material: { label: "資料", icon: FileText, color: "text-ink" },
  proposal: { label: "提案構成", icon: LayoutList, color: "text-mint-dark" },
};

const TYPE_ORDER: SearchResultType[] = ["faq", "script", "meeting", "product", "material", "proposal"];

type Props = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const typeFilter = (sp.type as SearchResultType | undefined) || undefined;
  const results = q ? await crossSearch(q, typeFilter) : [];

  // 種別ごとに集計
  const countsByType = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="検索結果"
        description={q ? `「${q}」で全コンテンツを検索しました` : "ヘッダーの検索欄からキーワードを入力してください"}
      />

      {q && (
        <div className="mb-5 flex flex-wrap gap-2">
          <TypeChip q={q} type={undefined} active={!typeFilter} count={results.length} label="すべて" />
          {TYPE_ORDER.map((t) => {
            const c = countsByType[t] ?? 0;
            if (c === 0) return null;
            return (
              <TypeChip
                key={t}
                q={q}
                type={t}
                active={typeFilter === t}
                count={c}
                label={TYPE_META[t].label}
              />
            );
          })}
        </div>
      )}

      {!q ? (
        <EmptyState icon={Search} title="キーワードを入力してください"
          description="上部の検索欄に単語を入れて Enter を押すと、全ポータルを横断検索します。" />
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title="結果が見つかりませんでした"
          description={`「${q}」に一致するコンテンツはありません。別のキーワードでお試しください。`} />
      ) : (
        <div className="space-y-3">
          {results.map((r) => {
            const meta = TYPE_META[r.type];
            const Icon = meta.icon;
            return (
              <Link key={`${r.type}-${r.id}`} href={r.href}>
                <Card className="p-0 transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-mint-softer", meta.color)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="mint">{meta.label}</Badge>
                        <span className="text-xs text-ink-soft">{formatRelative(r.updatedAt)}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold text-ink">{r.title}</p>
                      <p className="mt-1 text-xs text-ink-soft clamp-2">{r.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

/** 種別フィルターチップ */
function TypeChip({
  q, type, active, count, label,
}: {
  q: string;
  type: SearchResultType | undefined;
  active: boolean;
  count: number;
  label: string;
}) {
  const href = `/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ""}`;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-mint bg-mint text-white"
          : "border-line bg-white text-ink hover:bg-mint-softer",
      )}
    >
      {label}
      <span className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px]",
        active ? "bg-white/20" : "bg-line/60",
      )}>
        {count}
      </span>
    </Link>
  );
}
