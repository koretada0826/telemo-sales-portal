import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { MaterialCard } from "@/features/materials/components/material-card";
import { MaterialListControls } from "@/features/materials/components/material-list-controls";
import { listMaterials } from "@/lib/data-source/materials";

type Props = { searchParams: Promise<{ q?: string; sort?: string; page?: string }> };

export default async function MaterialsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listMaterials({
    q: sp.q, sort: (sp.sort as "newest" | "oldest") ?? "newest",
    page: Number(sp.page ?? "1"), perPage: 10,
  });
  return (
    <>
      <PageHeader title="提案資料" description="提案時に使う資料を管理・共有できます。"
        action={<Button asChild><Link href="/sales/materials/new"><Plus className="h-4 w-4" />新規資料を追加</Link></Button>} />
      <MaterialListControls />
      {result.items.length === 0 ? (
        <EmptyState icon={FileText} title="資料が見つかりません" description="検索条件を変えるか、新しい資料を追加してみてください。"
          action={<Button asChild><Link href="/sales/materials/new"><Plus className="h-4 w-4" />新規資料を追加</Link></Button>} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.items.map((m) => <MaterialCard key={m.id} material={m} />)}
          </div>
          <Pagination total={result.total} page={result.page} perPage={result.perPage} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}
