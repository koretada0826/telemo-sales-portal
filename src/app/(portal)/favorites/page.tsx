import Link from "next/link";
import { Star, BookOpen, MessageSquareText, Package, FileText, LayoutList } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/current-user";
import { listFavoritesByUser } from "@/lib/data-source/favorites";
import { getFaq } from "@/lib/data-source/faqs";
import { getScript } from "@/lib/data-source/scripts";
import { getProduct } from "@/lib/data-source/products";
import { getMaterial } from "@/lib/data-source/materials";
import { getProposal } from "@/lib/data-source/proposals";
import { formatRelative, truncate } from "@/lib/utils/format";
import type { FavoriteContentType } from "@/types/favorite";
import type { LucideIcon } from "lucide-react";

// お気に入り種別ごとのメタ情報
const TYPE_META: Record<FavoriteContentType, { label: string; icon: LucideIcon; hrefPrefix: string }> = {
  faq: { label: "FAQ", icon: BookOpen, hrefPrefix: "/knowledge/faqs/" },
  script: { label: "トークスクリプト", icon: MessageSquareText, hrefPrefix: "/training/scripts/" },
  product: { label: "商品理解", icon: Package, hrefPrefix: "/sales/products/" },
  material: { label: "提案資料", icon: FileText, hrefPrefix: "/sales/materials/" },
  proposal: { label: "提案構成", icon: LayoutList, hrefPrefix: "/sales/proposals/" },
};

/** お気に入り1件を種別に応じて詳細取得 → 表示用の情報を返す */
async function resolveFavorite(
  contentType: FavoriteContentType,
  contentId: string,
): Promise<{ title: string; excerpt: string; updatedAt: string } | null> {
  switch (contentType) {
    case "faq": {
      const f = await getFaq(contentId);
      return f ? { title: f.question, excerpt: truncate(f.answer, 120), updatedAt: f.updatedAt } : null;
    }
    case "script": {
      const s = await getScript(contentId);
      return s ? { title: s.name, excerpt: truncate(s.opening || s.productPitch, 120), updatedAt: s.updatedAt } : null;
    }
    case "product": {
      const p = await getProduct(contentId);
      return p ? { title: p.productName, excerpt: truncate(p.overview, 120), updatedAt: p.updatedAt } : null;
    }
    case "material": {
      const m = await getMaterial(contentId);
      return m ? { title: m.name, excerpt: truncate(m.description, 120), updatedAt: m.updatedAt } : null;
    }
    case "proposal": {
      const pr = await getProposal(contentId);
      return pr ? { title: pr.name, excerpt: truncate(pr.purpose, 120), updatedAt: pr.updatedAt } : null;
    }
  }
}

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const favs = await listFavoritesByUser(user.id);

  // 並列で各お気に入りの実データを取得
  const resolved = await Promise.all(
    favs.map(async (f) => {
      const d = await resolveFavorite(f.contentType, f.contentId);
      return d ? { fav: f, ...d } : null;
    }),
  );
  const items = resolved.filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <>
      <PageHeader
        title="お気に入り"
        description={`${user.name} さんがお気に入り登録したコンテンツ一覧です。`}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="お気に入りはまだありません"
          description="FAQ・スクリプト・商品情報などの詳細ページで★を押すと、ここに集まります。"
          action={
            <Button asChild variant="outline">
              <Link href="/knowledge/faqs">FAQ一覧を見る</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {items.map(({ fav, title, excerpt, updatedAt }) => {
            const meta = TYPE_META[fav.contentType];
            const Icon = meta.icon;
            return (
              <Card key={fav.id} className="p-0">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-mint-softer text-mint-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="mint">{meta.label}</Badge>
                        <span className="text-xs text-ink-soft">
                          お気に入り登録：{formatRelative(fav.createdAt)}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-ink sm:text-lg">{title}</h3>
                      <p className="mt-1 text-sm text-ink-soft clamp-2">{excerpt}</p>
                      <p className="mt-2 text-xs text-ink-soft">
                        コンテンツ更新：{formatRelative(updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end border-t border-line bg-mint-softer/40 px-6 py-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${meta.hrefPrefix}${fav.contentId}`}>詳細を見る</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>種類別の登録数</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {(Object.keys(TYPE_META) as FavoriteContentType[]).map((t) => {
            const meta = TYPE_META[t];
            const count = favs.filter((f) => f.contentType === t).length;
            const Icon = meta.icon;
            return (
              <div key={t} className="flex items-center gap-3 rounded-btn border border-line p-3">
                <Icon className="h-5 w-5 text-mint" />
                <div>
                  <p className="text-xs text-ink-soft">{meta.label}</p>
                  <p className="text-lg font-bold text-ink">{count}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
