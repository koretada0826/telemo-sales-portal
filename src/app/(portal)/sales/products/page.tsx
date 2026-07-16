import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductListControls } from "@/features/products/components/product-list-controls";
import { listProducts } from "@/lib/data-source/products";

type Props = { searchParams: Promise<{ q?: string; sort?: string; page?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listProducts({
    q: sp.q, sort: (sp.sort as "newest" | "oldest") ?? "newest",
    page: Number(sp.page ?? "1"), perPage: 10,
  });
  return (
    <>
      <PageHeader title="商品理解" description="自社商品・サービスの理解を深めるための情報集です。"
        action={<Button asChild><Link href="/sales/products/new"><Plus className="h-4 w-4" />新規商品を追加</Link></Button>} />
      <ProductListControls />
      {result.items.length === 0 ? (
        <EmptyState icon={Package} title="商品情報が見つかりません"
          description="検索条件を変えるか、新しい商品を追加してみてください。"
          action={<Button asChild><Link href="/sales/products/new"><Plus className="h-4 w-4" />新規商品を追加</Link></Button>} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <Pagination total={result.total} page={result.page} perPage={result.perPage} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}
