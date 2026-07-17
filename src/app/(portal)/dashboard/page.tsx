import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, MessageSquareText, ArrowRight, Sparkles,
  Package, FileText, LayoutList, Bell, Calendar, HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import { countFaqs, countUnansweredFaqs, listRecentFaqs } from "@/lib/data-source/faqs";
import { countScripts } from "@/lib/data-source/scripts";
import { countProducts } from "@/lib/data-source/products";
import { countMaterials } from "@/lib/data-source/materials";
import { countProposals } from "@/lib/data-source/proposals";
import { getFaqCategory } from "@/data/mock/categories";
import { getMockUser } from "@/data/mock/users";
import { getCurrentUser } from "@/lib/current-user";
import { formatRelative, truncate } from "@/lib/utils/format";

/**
 * ダッシュボード：ナレッジ・資料系5コンテンツの件数と最近更新を集約表示。
 * 架電・商談の集計（今月件数/次回予定）はユーザー指示で非表示。
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [
    faqTotal, unansweredCount, scriptTotal, productTotal, materialTotal, proposalTotal, recentFaqs,
  ] = await Promise.all([
    countFaqs(), countUnansweredFaqs(), countScripts(), countProducts(),
    countMaterials(), countProposals(),
    listRecentFaqs(5),
  ]);

  return (
    <>
      <PageHeader
        title={`ようこそ、${user.name} さん`}
        description="ナレッジと営業資料の状況をひと目で確認できます。"
      />

      {/* 未回答質問バナー：0件なら非表示 */}
      {unansweredCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-warning/30 bg-warning/10 p-4">
          <div className="flex items-center gap-2 text-sm text-warning">
            <HelpCircle className="h-5 w-5" />
            未回答の質問が <span className="font-bold">{unansweredCount}</span> 件あります。
            みんなで解決しましょう。
          </div>
          <Link
            href="/knowledge/faqs?unanswered=1"
            className="inline-flex items-center gap-1 text-sm font-medium text-warning hover:opacity-80"
          >
            未回答一覧を見る<ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ナレッジ・営業資料の件数サマリー：1枚のカードに5項目を縦リスト表示 */}
      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-line">
          <SummaryRow icon={BookOpen} label="FAQ 総数" value={faqTotal} href="/knowledge/faqs" />
          <SummaryRow icon={MessageSquareText} label="トークスクリプト" value={scriptTotal} href="/training/scripts" />
          <SummaryRow icon={Package} label="商品情報" value={productTotal} href="/sales/products" />
          <SummaryRow icon={FileText} label="提案資料" value={materialTotal} href="/sales/materials" />
          <SummaryRow icon={LayoutList} label="提案構成" value={proposalTotal} href="/sales/proposals" />
        </ul>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* 左：最近更新されたFAQ */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>最近更新されたFAQ</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/knowledge/faqs">
                すべて見る<ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-line p-0">
            {recentFaqs.length === 0 ? (
              <p className="p-6 text-sm text-ink-soft">まだFAQが登録されていません。</p>
            ) : (
              recentFaqs.map((f) => {
                const cat = getFaqCategory(f.categoryId);
                const author = getMockUser(f.updaterId);
                return (
                  <Link
                    key={f.id}
                    href={`/knowledge/faqs/${f.id}`}
                    className="block px-5 py-4 transition-colors hover:bg-mint-softer/50"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-soft text-xs font-bold text-mint-dark">
                        Q
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{f.question}</p>
                        <p className="mt-1 text-xs text-ink-soft clamp-2">
                          {truncate(f.answer, 80)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                          {cat && <Badge variant="mint">{cat.name}</Badge>}
                          <span>{author?.name}</span>
                          <span>{formatRelative(f.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* 右：コンテンツ追加ショートカット + 通知 + ヒント（右カラムの重量バランス確保） */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-mint" />
                コンテンツ追加
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <ShortcutLink href="/knowledge/faqs/new" label="新規FAQを追加" />
              <ShortcutLink href="/training/scripts/new" label="新規スクリプトを追加" />
              <ShortcutLink href="/sales/products/new" label="新規商品を追加" />
              <ShortcutLink href="/sales/materials/new" label="新規資料を追加" />
              <ShortcutLink href="/sales/proposals/new" label="新規構成を追加" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-mint" />
                未読通知
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-ink-soft">
              新しい通知はありません。（通知機能はフェーズ6で実装）
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-mint" />
                今日のヒント
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-ink-soft">
              ナレッジ集はキーワード検索が高速です。用語検索でFAQ・トークスクリプトを横断して探せます。
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

/** 右カラム「コンテンツ追加」の1リンク */
function ShortcutLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-btn border border-line px-3 py-2 text-ink hover:bg-mint-softer"
    >
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-mint" />
    </Link>
  );
}

/** サマリーカード内の1行。行全体がリンクで、右端に件数+矢印。 */
function SummaryRow({
  icon: Icon, label, value, href,
}: {
  icon: LucideIcon; label: string; value: number; href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mint-softer/40 sm:px-5 sm:py-3.5"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-softer text-mint-dark transition-colors group-hover:bg-mint group-hover:text-white">
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1 truncate text-sm font-medium text-ink sm:text-base">{label}</span>
        <span className="text-base font-bold text-ink sm:text-lg">
          {formatNumber(value)}
          <span className="ml-0.5 text-xs font-normal text-ink-soft">件</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-mint" />
      </Link>
    </li>
  );
}
