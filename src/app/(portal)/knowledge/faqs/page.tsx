import Link from "next/link";
import { Plus, BookOpen, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { FaqCard } from "@/features/faqs/components/faq-card";
import { FaqListControls } from "@/features/faqs/components/faq-list-controls";
import { QuickQuestionButton } from "@/features/faqs/components/quick-question-button";
import { listFaqs, countUnansweredFaqs } from "@/lib/data-source/faqs";

type Props = {
  searchParams: Promise<{
    q?: string;
    categoryId?: string;
    sort?: string;
    page?: string;
    unanswered?: string;
  }>;
};

export default async function FaqsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1");
  const unansweredOnly = sp.unanswered === "1";

  // FAQ一覧と未回答総数を並列取得
  const [result, unansweredCount] = await Promise.all([
    listFaqs({
      q: sp.q,
      categoryId: sp.categoryId,
      unansweredOnly,
      sort: (sp.sort as "newest" | "oldest" | "most-viewed" | "most-favorited") ?? "newest",
      page,
      perPage: 10,
    }),
    countUnansweredFaqs(),
  ]);

  return (
    <>
      <PageHeader
        title="ナレッジ集(FAQ)"
        description="よくある質問と回答を検索・追加できます。回答が分からない質問だけを投稿することもできます。"
        action={
          <div className="flex flex-wrap gap-2">
            {/* 質問だけ投稿ボタン（モーダル） */}
            <QuickQuestionButton />
            {/* 従来の「Q+A両方入力」新規追加 */}
            <Button asChild>
              <Link href="/knowledge/faqs/new">
                <Plus className="h-4 w-4" />
                新規FAQを追加
              </Link>
            </Button>
          </div>
        }
      />

      {/* 未回答件数バナー：0件のときは非表示 */}
      {unansweredCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-card border border-warning/30 bg-warning/10 p-4">
          <div className="flex items-center gap-2 text-sm text-warning">
            <HelpCircle className="h-4 w-4" />
            未回答の質問が <span className="font-bold">{unansweredCount}</span> 件あります。
          </div>
          <Link
            href="/knowledge/faqs?unanswered=1"
            className="text-xs font-medium text-warning underline hover:no-underline"
          >
            未回答だけ表示
          </Link>
        </div>
      )}

      {/* 検索・絞込・並び替え */}
      <FaqListControls />

      {result.items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="FAQが見つかりません"
          description="検索条件を変えるか、新しいFAQを追加してみてください。"
          action={
            <Button asChild>
              <Link href="/knowledge/faqs/new">
                <Plus className="h-4 w-4" />
                新規FAQを追加
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-5">
            {result.items.map((faq) => (
              <FaqCard key={faq.id} faq={faq} />
            ))}
          </div>
          <Pagination
            total={result.total}
            page={result.page}
            perPage={result.perPage}
            totalPages={result.totalPages}
          />
        </>
      )}
    </>
  );
}
