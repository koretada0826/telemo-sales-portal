import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getProduct } from "@/lib/data-source/products";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isFavorited } from "@/lib/data-source/favorites";
import { deleteProductAction } from "@/features/products/actions";
import { getCurrentUser } from "@/lib/current-user";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime } from "@/lib/utils/format";

type Props = { params: Promise<{ id: string }> };

// タブに表示するセクション定義
const TABS = [
  { key: "basic", label: "基本情報" },
  { key: "target", label: "対象顧客" },
  { key: "issue", label: "課題と価値" },
  { key: "features", label: "機能" },
  { key: "pricing", label: "料金" },
  { key: "competitor", label: "競合比較" },
  { key: "faq", label: "FAQ" },
  { key: "related", label: "関連資料" },
] as const;

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();
  const author = getMockUser(p.updaterId);
  const user = await getCurrentUser();
  const canEdit =
    user.role === "admin" || user.role === "manager" ||
    (user.role === "member" && p.authorId === user.id);
  const boundDelete = deleteProductAction.bind(null, p.id);
  const favorited = await isFavorited(user.id, "product", p.id);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sales/products"><ArrowLeft className="h-4 w-4" />一覧に戻る</Link>
        </Button>
      </div>
      <PageHeader
        title={p.productName}
        description={p.serviceName}
        action={
          <div className="flex flex-wrap gap-2">
            <FavoriteButton contentType="product" contentId={p.id} initialFavorited={favorited} />
            {canEdit && (
              <>
                <Button asChild variant="secondary">
                  <Link href={`/sales/products/${p.id}/edit`}><Pencil className="h-4 w-4" />編集</Link>
                </Button>
                <ConfirmDeleteButton label={p.productName} onConfirm={boundDelete} />
              </>
            )}
          </div>
        }
      />

      <Card className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="mint">{p.targetIndustry || "業界未設定"}</Badge>
          <span className="text-xs text-ink-soft">更新：{formatDateTime(p.updatedAt)}</span>
          {author && <span className="text-xs text-ink-soft">・{author.name}</span>}
        </div>
        <p className="mt-3 text-sm leading-7 text-ink">{p.overview}</p>
      </Card>

      <Tabs defaultValue="basic" className="mt-2">
        <TabsList className="overflow-x-auto">
          {TABS.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="basic">
          <Card><CardContent className="pt-5"><p className="whitespace-pre-line text-sm leading-7 text-ink">{p.overview}</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="target">
          <SectionCard title="対象顧客" body={p.targetCustomer} />
          <SectionCard title="対象業界" body={p.targetIndustry} />
        </TabsContent>
        <TabsContent value="issue">
          <SectionCard title="顧客課題" body={p.customerIssue} />
          <SectionCard title="提供価値" body={p.value} />
        </TabsContent>
        <TabsContent value="features">
          <SectionCard title="機能" body={p.features} />
          <SectionCard title="特徴" body={p.strengths} />
        </TabsContent>
        <TabsContent value="pricing">
          <SectionCard title="料金" body={p.pricing} />
          <SectionCard title="導入までの流れ" body={p.implementationFlow} />
        </TabsContent>
        <TabsContent value="competitor">
          <SectionCard title="競合" body={p.competitors} />
          <SectionCard title="競合優位性" body={p.competitiveAdvantage} />
        </TabsContent>
        <TabsContent value="faq">
          <SectionCard title="よくある質問" body={p.faq} />
          <SectionCard title="注意事項" body={p.notes} />
        </TabsContent>
        <TabsContent value="related">
          <Card><CardContent className="pt-5"><p className="text-sm text-ink-soft">関連資料の紐付けはフェーズ5で実装予定。</p></CardContent></Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <CommentsSection contentType="product" contentId={p.id} />
      </div>
    </>
  );
}

function SectionCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="mt-3">
      <CardContent className="pt-5">
        <p className="mb-2 text-sm font-semibold text-ink-soft">{title}</p>
        <p className="whitespace-pre-line text-sm leading-7 text-ink">{body || "（未入力）"}</p>
      </CardContent>
    </Card>
  );
}
