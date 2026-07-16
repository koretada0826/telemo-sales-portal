import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, User, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CopyButton } from "@/features/scripts/components/copy-button";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { isFavorited } from "@/lib/data-source/favorites";
import { getScript } from "@/lib/data-source/scripts";
import { deleteScriptAction } from "@/features/scripts/actions";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime } from "@/lib/utils/format";
import { SCRIPT_SCENE_LABEL } from "@/types/script";
import { getCurrentUser } from "@/lib/current-user";

type Props = { params: Promise<{ id: string }> };

// スクリプトの各セクション定義（タイトルと値の取り出し方）
const SECTIONS = [
  { key: "opening", title: "冒頭トーク" },
  { key: "hearing", title: "ヒアリング項目" },
  { key: "problemRaise", title: "課題提起" },
  { key: "productPitch", title: "商品説明" },
  { key: "closing", title: "クロージング" },
  { key: "objectionHandling", title: "反論処理" },
  { key: "notes", title: "注意事項" },
] as const;

export default async function ScriptDetailPage({ params }: Props) {
  const { id } = await params;
  const script = await getScript(id);
  if (!script) notFound();

  const author = getMockUser(script.authorId);
  const user = await getCurrentUser();
  const canEdit =
    user.role === "admin" ||
    user.role === "manager" ||
    (user.role === "member" && script.authorId === user.id);

  // 全セクションを繋げた文字列（全文コピー用）
  const fullText = SECTIONS.filter((s) => script[s.key]).map((s) => `【${s.title}】\n${script[s.key]}`).join("\n\n");

  // Server ActionをClient Componentに渡すためのバインド
  const boundDelete = deleteScriptAction.bind(null, script.id);
  const favorited = await isFavorited(user.id, "script", script.id);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/training/scripts"><ArrowLeft className="h-4 w-4" />一覧に戻る</Link>
        </Button>
      </div>

      <PageHeader
        title={script.name}
        description={`利用シーン：${SCRIPT_SCENE_LABEL[script.scene]}`}
        action={
          <div className="flex flex-wrap gap-2">
            <FavoriteButton contentType="script" contentId={script.id} initialFavorited={favorited} />
            <CopyButton text={fullText} label="全文コピー" />
            {canEdit && (
              <>
                <Button asChild variant="secondary">
                  <Link href={`/training/scripts/${script.id}/edit`}>
                    <Pencil className="h-4 w-4" />編集
                  </Link>
                </Button>
                <ConfirmDeleteButton label={script.name} onConfirm={boundDelete} />
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 左：各セクション */}
        <div className="space-y-4">
          {SECTIONS.map((sec) => {
            const value = script[sec.key];
            if (!value) return null;
            return (
              <Card key={sec.key}>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>{sec.title}</CardTitle>
                  <CopyButton text={value} label="この節をコピー" />
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm leading-7 text-ink">{value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 右：メタ情報 */}
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>基本情報</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row icon={<User className="h-4 w-4" />} label="作成者">{author?.name ?? "-"}</Row>
              <Row icon={<Calendar className="h-4 w-4" />} label="作成">{formatDateTime(script.createdAt)}</Row>
              <Row icon={<Calendar className="h-4 w-4" />} label="更新">{formatDateTime(script.updatedAt)}</Row>
              {script.industry && (
                <Row label="対象業界">
                  <Badge variant="gray">{script.industry}</Badge>
                </Row>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="mt-8">
        <CommentsSection contentType="script" contentId={script.id} />
      </div>
    </>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-ink-soft">{icon}{label}</span>
      <span className="text-ink">{children}</span>
    </div>
  );
}
