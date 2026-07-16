import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { getProposal } from "@/lib/data-source/proposals";
import { deleteProposalAction } from "@/features/proposals/actions";
import { DuplicateProposalButton } from "@/features/proposals/components/duplicate-button";
import { getCurrentUser } from "@/lib/current-user";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime } from "@/lib/utils/format";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isFavorited } from "@/lib/data-source/favorites";

type Props = { params: Promise<{ id: string }> };

// 固定セクション一覧
const FIXED_SECTIONS = [
  { key: "purpose", title: "提案目的" },
  { key: "currentState", title: "現状整理" },
  { key: "issue", title: "課題" },
  { key: "cause", title: "原因" },
  { key: "solution", title: "解決策" },
  { key: "benefit", title: "導入メリット" },
  { key: "flow", title: "導入フロー" },
  { key: "pricing", title: "料金提示" },
  { key: "closing", title: "クロージング" },
  { key: "supplement", title: "補足" },
] as const;

export default async function ProposalDetailPage({ params }: Props) {
  const { id } = await params;
  const p = await getProposal(id);
  if (!p) notFound();
  const user = await getCurrentUser();
  const author = getMockUser(p.authorId);
  const canEdit =
    user.role === "admin" || user.role === "manager" ||
    (user.role === "member" && p.authorId === user.id);
  const boundDelete = deleteProposalAction.bind(null, p.id);
  const favorited = await isFavorited(user.id, "proposal", p.id);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sales/proposals"><ArrowLeft className="h-4 w-4" />一覧に戻る</Link>
        </Button>
      </div>
      <PageHeader
        title={p.name}
        description={p.targetCustomer}
        action={
          <div className="flex flex-wrap gap-2">
            <FavoriteButton contentType="proposal" contentId={p.id} initialFavorited={favorited} />
            <DuplicateProposalButton id={p.id} />
            {canEdit && (
              <>
                <Button asChild variant="secondary">
                  <Link href={`/sales/proposals/${p.id}/edit`}><Pencil className="h-4 w-4" />編集</Link>
                </Button>
                <ConfirmDeleteButton label={p.name} onConfirm={boundDelete} />
              </>
            )}
          </div>
        }
      />

      <Card className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {p.targetIndustry && <Badge variant="mint">{p.targetIndustry}</Badge>}
          {author && <span className="text-xs text-ink-soft">作成：{author.name}</span>}
          <span className="text-xs text-ink-soft">・更新：{formatDateTime(p.updatedAt)}</span>
        </div>
      </Card>

      <div className="space-y-4">
        {FIXED_SECTIONS.map((sec) => {
          const val = p[sec.key];
          return (
            <Card key={sec.key}>
              <CardContent className="pt-5">
                <p className="mb-2 text-sm font-semibold text-mint-dark">{sec.title}</p>
                <p className="whitespace-pre-line text-sm leading-7 text-ink">{val || "（未入力）"}</p>
              </CardContent>
            </Card>
          );
        })}
        {p.extraSections.length > 0 && <div className="my-6 h-px bg-line" />}
        {p.extraSections.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-5">
              <p className="mb-2 text-sm font-semibold text-mint-dark">{s.title}（追加セクション）</p>
              <p className="whitespace-pre-line text-sm leading-7 text-ink">{s.body || "（未入力）"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <CommentsSection contentType="proposal" contentId={p.id} />
      </div>
    </>
  );
}
