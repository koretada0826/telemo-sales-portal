import Link from "next/link";
import { ArrowRight, Eye, Heart, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attribution } from "@/components/ui/attribution";
import type { Faq } from "@/types/faq";
import { getFaqCategory } from "@/data/mock/categories";
import { getTags } from "@/data/mock/tags";
import { formatRelative, formatNumber, truncate } from "@/lib/utils/format";
import { AnswerFaqButton } from "./answer-faq-button";

type Props = { faq: Faq };

/**
 * FAQ1件を表示するカード。
 * 質問者・回答者を明示（未回答なら回答者は非表示）
 */
export function FaqCard({ faq }: Props) {
  const category = getFaqCategory(faq.categoryId);
  const tags = getTags(faq.tagIds);
  const isUnanswered = faq.answer.trim().length === 0;

  return (
    <Card className="p-0">
      <div className="p-4 sm:p-6">
        {/* Q（質問） */}
        <div className="flex items-start gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-sm font-bold text-mint-dark"
            aria-hidden="true"
          >
            Q
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {isUnanswered && (
                <Badge variant="warning">
                  <HelpCircle className="mr-1 h-3 w-3" />
                  未回答
                </Badge>
              )}
            </div>
            <h3 className="mt-1 text-base font-semibold text-ink sm:text-lg">
              {faq.question}
            </h3>
          </div>
        </div>

        {/* A（回答の一部 / 未回答時はプレースホルダー） */}
        <div className="mt-4 flex items-start gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar text-sm font-bold text-white"
            aria-hidden="true"
          >
            A
          </span>
          {isUnanswered ? (
            <p className="pt-1 text-sm italic text-ink-soft/80">
              まだ回答がありません。あなたの知見をシェアしてみませんか？
            </p>
          ) : (
            <p className="pt-1 text-sm text-ink-soft clamp-3">
              {truncate(faq.answer, 140)}
            </p>
          )}
        </div>

        <div className="mt-5 h-[2px] w-24 rounded-full bg-mint/50" />

        {/* 下部メタ情報 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {category && <Badge variant="mint">{category.name}</Badge>}
            {tags.slice(0, 3).map((t) => (
              <Badge key={t.id} variant="gray">
                #{t.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline">+{tags.length - 3}</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* 質問者 + 回答者（Q&Aモード） */}
            <Attribution
              authorId={faq.authorId}
              updaterId={faq.updaterId}
              isQA
              unanswered={isUnanswered}
            />
            <span className="text-xs text-ink-soft">更新 {formatRelative(faq.updatedAt)}</span>
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(faq.viewCount)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
              <Heart className="h-3.5 w-3.5" />
              {formatNumber(faq.favoriteCount)}
            </span>
          </div>
        </div>
      </div>

      {/* 右下の操作エリア */}
      <div className="flex items-center justify-end gap-2 border-t border-line bg-mint-softer/40 px-4 py-3 sm:px-6">
        {isUnanswered && (
          <AnswerFaqButton faqId={faq.id} question={faq.question} variant="primary" />
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/knowledge/faqs/${faq.id}`}>
            詳細を見る
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
