import Link from "next/link";
import { Plus, MessageSquareText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ScriptCard } from "@/features/scripts/components/script-card";
import { ScriptListControls } from "@/features/scripts/components/script-list-controls";
import { listScripts } from "@/lib/data-source/scripts";

type Props = {
  searchParams: Promise<{ q?: string; scene?: string; sort?: string; page?: string }>;
};

export default async function ScriptsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listScripts({
    q: sp.q,
    sort: (sp.sort as "newest" | "oldest") ?? "newest",
    page: Number(sp.page ?? "1"),
    perPage: 10,
  });
  // シーン絞込はdata-sourceに未実装のため、ここで簡易フィルター
  const filtered = sp.scene ? result.items.filter((s) => s.scene === sp.scene) : result.items;

  return (
    <>
      <PageHeader
        title="トークスクリプト集"
        description="営業トークの標準スクリプトを管理・共有できます。"
        action={
          <Button asChild>
            <Link href="/training/scripts/new">
              <Plus className="h-4 w-4" />
              新規スクリプトを追加
            </Link>
          </Button>
        }
      />
      <ScriptListControls />
      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="スクリプトが見つかりません"
          description="検索条件を変えるか、新しいスクリプトを追加してみてください。"
          action={
            <Button asChild>
              <Link href="/training/scripts/new">
                <Plus className="h-4 w-4" />新規スクリプトを追加
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-5">
            {filtered.map((s) => <ScriptCard key={s.id} script={s} />)}
          </div>
          <Pagination total={result.total} page={result.page} perPage={result.perPage} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}
