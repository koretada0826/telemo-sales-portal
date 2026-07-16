import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Download, FileText, Calendar, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { getMaterial } from "@/lib/data-source/materials";
import { deleteMaterialAction } from "@/features/materials/actions";
import { getCurrentUser } from "@/lib/current-user";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime, formatNumber } from "@/lib/utils/format";
import { FILE_KIND_LABEL } from "@/types/material";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isFavorited } from "@/lib/data-source/favorites";

type Props = { params: Promise<{ id: string }> };

export default async function MaterialDetailPage({ params }: Props) {
  const { id } = await params;
  const m = await getMaterial(id);
  if (!m) notFound();
  const author = getMockUser(m.authorId);
  const user = await getCurrentUser();
  const canEdit =
    user.role === "admin" || user.role === "manager" ||
    (user.role === "member" && m.authorId === user.id);
  const boundDelete = deleteMaterialAction.bind(null, m.id);
  const favorited = await isFavorited(user.id, "material", m.id);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sales/materials"><ArrowLeft className="h-4 w-4" />一覧に戻る</Link>
        </Button>
      </div>
      <PageHeader
        title={m.name} description={m.description}
        action={
          <div className="flex flex-wrap gap-2">
            <FavoriteButton contentType="material" contentId={m.id} initialFavorited={favorited} />
            <Button variant="secondary" disabled title="実ダウンロードはフェーズ5で対応">
              <Download className="h-4 w-4" />ダウンロード
            </Button>
            {canEdit && (
              <>
                <Button asChild variant="secondary">
                  <Link href={`/sales/materials/${m.id}/edit`}><Pencil className="h-4 w-4" />編集</Link>
                </Button>
                <ConfirmDeleteButton label={m.name} onConfirm={boundDelete} />
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-mint" />資料プレビュー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-btn border border-dashed border-line bg-mint-softer/40 text-center">
              <div>
                <FileText className="mx-auto h-10 w-10 text-mint-dark" />
                <p className="mt-2 text-sm text-ink-soft">{m.fileName}</p>
                <p className="mt-1 text-xs text-ink-soft">プレビュー機能はフェーズ5で対応予定</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>ファイル情報</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="種別"><Badge variant="outline">{FILE_KIND_LABEL[m.fileKind]}</Badge></Row>
              <Row label="サイズ">{formatNumber(m.fileSizeKb)} KB</Row>
              <Row label="バージョン">v{m.version}</Row>
              {m.targetIndustry && <Row label="対象業界">{m.targetIndustry}</Row>}
              {m.scene && <Row label="利用シーン">{m.scene}</Row>}
              {author && <Row icon={<User className="h-4 w-4" />} label="作成者">{author.name}</Row>}
              <Row icon={<Calendar className="h-4 w-4" />} label="更新">{formatDateTime(m.updatedAt)}</Row>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="mt-8">
        <CommentsSection contentType="material" contentId={m.id} />
      </div>
    </>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-ink-soft">{icon}{label}</span>
      <span className="text-right text-ink">{children}</span>
    </div>
  );
}
