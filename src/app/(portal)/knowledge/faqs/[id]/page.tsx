import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  User,
  Calendar,
  Eye,
  Heart,
  Shield,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { FaqDeleteButton } from "@/features/faqs/components/faq-delete-button";
import { AnswerFaqButton } from "@/features/faqs/components/answer-faq-button";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isFavorited } from "@/lib/data-source/favorites";
import { HelpCircle } from "lucide-react";
import {
  getFaq,
  getFaqsByIds,
  incrementFaqView,
} from "@/lib/data-source/faqs";
import { getFaqCategory } from "@/data/mock/categories";
import { getTags } from "@/data/mock/tags";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime, formatNumber } from "@/lib/utils/format";
import { getCurrentUser } from "@/lib/current-user";

// 公開範囲の日本語ラベル
const VIEWABLE_LABEL: Record<string, string> = {
  everyone: "誰でも閲覧可",
  member: "メンバー以上",
  manager: "マネージャー以上",
  admin: "管理者のみ",
};

// 公開状態の日本語ラベル + バッジ色
const VISIBILITY_LABEL: Record<string, { label: string; variant: "success" | "gray" | "warning" }> = {
  public: { label: "公開中", variant: "success" },
  draft: { label: "下書き", variant: "warning" },
  private: { label: "非公開", variant: "gray" },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FaqDetailPage({ params }: Props) {
  const { id } = await params;
  const faq = await getFaq(id);
  if (!faq) notFound();

  // 閲覧数を+1（Server Component内なので副作用として実行）
  // ※本番はrateLimitやreferrer検証を追加すべき
  await incrementFaqView(id);

  const category = getFaqCategory(faq.categoryId);
  const tags = getTags(faq.tagIds);
  const author = getMockUser(faq.authorId);
  const updater = getMockUser(faq.updaterId);
  const relatedFaqs = await getFaqsByIds(faq.relatedFaqIds);
  const user = await getCurrentUser();

  // 編集・削除ボタンの表示条件
  // admin/manager は常に、member は自分の投稿のみ、viewer は非表示
  const canEdit =
    user.role === "admin" ||
    user.role === "manager" ||
    (user.role === "member" && faq.authorId === user.id);

  const vis = VISIBILITY_LABEL[faq.visibility];
  const isUnanswered = faq.answer.trim().length === 0;
  const favorited = await isFavorited(user.id, "faq", faq.id);

  return (
    <>
      {/* 戻るリンク */}
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/knowledge/faqs">
            <ArrowLeft className="h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
      </div>

      <PageHeader
        title="FAQ 詳細"
        action={
          <div className="flex flex-wrap gap-2">
            <FavoriteButton contentType="faq" contentId={faq.id} initialFavorited={favorited} />
            {isUnanswered && (
              <AnswerFaqButton
                faqId={faq.id}
                question={faq.question}
                variant="primary"
                label="この質問に答える"
              />
            )}
            {canEdit && (
              <>
                <Button asChild variant="secondary">
                  <Link href={`/knowledge/faqs/${faq.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    編集
                  </Link>
                </Button>
                <FaqDeleteButton faqId={faq.id} question={faq.question} />
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ===== 左：本体 ===== */}
        <div className="space-y-6">
          {/* 質問 */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-soft text-sm font-bold text-mint-dark"
                aria-hidden="true"
              >
                Q
              </span>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-ink sm:text-2xl">
                  {faq.question}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {isUnanswered && (
                    <Badge variant="warning">
                      <HelpCircle className="mr-1 h-3 w-3" />
                      未回答
                    </Badge>
                  )}
                  {category && <Badge variant="mint">{category.name}</Badge>}
                  <Badge variant={vis.variant}>{vis.label}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* 回答（未回答なら回答呼びかけ + ボタン） */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar text-sm font-bold text-white"
                aria-hidden="true"
              >
                A
              </span>
              {isUnanswered ? (
                <div className="flex-1">
                  <p className="text-sm italic text-ink-soft">
                    まだ回答がありません。あなたの知見をシェアしてみませんか？
                  </p>
                  <div className="mt-4">
                    <AnswerFaqButton
                      faqId={faq.id}
                      question={faq.question}
                      variant="primary"
                      label="この質問に答える"
                    />
                  </div>
                </div>
              ) : (
                <p className="flex-1 whitespace-pre-line text-sm leading-7 text-ink">
                  {faq.answer}
                </p>
              )}
            </div>
          </Card>

          {/* タグ */}
          {tags.length > 0 && (
            <Card className="p-4 sm:p-6">
              <p className="mb-3 text-sm font-semibold text-ink-soft">タグ</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Badge key={t.id} variant="gray">
                    #{t.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* 関連FAQ */}
          {relatedFaqs.length > 0 && (
            <Card className="p-4 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <Link2 className="h-4 w-4" />
                関連FAQ
              </p>
              <ul className="space-y-2">
                {relatedFaqs.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/knowledge/faqs/${r.id}`}
                      className="block rounded-btn border border-line px-4 py-3 text-sm text-ink hover:bg-mint-softer"
                    >
                      Q. {r.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* ===== 右：メタ情報サイドバー ===== */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>投稿情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row icon={<User className="h-4 w-4" />} label="質問者">
                {author?.name ?? "-"}
              </Row>
              <Row icon={<User className="h-4 w-4" />} label="回答者">
                {isUnanswered ? (
                  <span className="text-warning">未回答</span>
                ) : (
                  updater?.name ?? "-"
                )}
              </Row>
              <Row icon={<Calendar className="h-4 w-4" />} label="質問日時">
                {formatDateTime(faq.createdAt)}
              </Row>
              <Row icon={<Calendar className="h-4 w-4" />} label="最終更新">
                {formatDateTime(faq.updatedAt)}
              </Row>
              <Row icon={<Shield className="h-4 w-4" />} label="閲覧権限">
                {VIEWABLE_LABEL[faq.viewableBy] ?? faq.viewableBy}
              </Row>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-btn bg-mint-softer p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-ink-soft">
                  <Eye className="h-3.5 w-3.5" />
                  閲覧数
                </div>
                <p className="mt-1 text-xl font-bold text-mint-dark">
                  {formatNumber(faq.viewCount)}
                </p>
              </div>
              <div className="rounded-btn bg-mint-softer p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-ink-soft">
                  <Heart className="h-3.5 w-3.5" />
                  お気に入り
                </div>
                <p className="mt-1 text-xl font-bold text-mint-dark">
                  {formatNumber(faq.favoriteCount)}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* コメントセクション */}
      <div className="mt-8">
        <CommentsSection contentType="faq" contentId={faq.id} />
      </div>
    </>
  );
}

/** メタ情報カード内の1行を表示する小さな部品 */
function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-ink-soft">
        {icon}
        {label}
      </span>
      <span className="text-ink">{children}</span>
    </div>
  );
}
