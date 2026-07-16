import Link from "next/link";
import { Plus, LayoutList } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ProposalCard } from "@/features/proposals/components/proposal-card";
import { ProposalListControls } from "@/features/proposals/components/proposal-list-controls";
import { listProposals } from "@/lib/data-source/proposals";

type Props = { searchParams: Promise<{ q?: string; sort?: string; page?: string }> };

export default async function ProposalsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listProposals({
    q: sp.q, sort: (sp.sort as "newest" | "oldest") ?? "newest",
    page: Number(sp.page ?? "1"), perPage: 10,
  });
  return (
    <>
      <PageHeader title="提案構成" description="提案書の構成テンプレートを作成・並び替えできます。"
        action={<Button asChild><Link href="/sales/proposals/new"><Plus className="h-4 w-4" />新規構成を追加</Link></Button>} />
      <ProposalListControls />
      {result.items.length === 0 ? (
        <EmptyState icon={LayoutList} title="提案構成が見つかりません"
          description="検索条件を変えるか、新しい構成を追加してみてください。"
          action={<Button asChild><Link href="/sales/proposals/new"><Plus className="h-4 w-4" />新規構成を追加</Link></Button>} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.items.map((p) => <ProposalCard key={p.id} proposal={p} />)}
          </div>
          <Pagination total={result.total} page={result.page} perPage={result.perPage} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}
