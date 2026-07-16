import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Calendar, User, FileText, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { getMeeting } from "@/lib/data-source/meetings";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { deleteMeetingAction } from "@/features/meetings/actions";
import { getMockUser } from "@/data/mock/users";
import { formatDateTime } from "@/lib/utils/format";
import {
  MEETING_STATUS_LABEL, MEETING_STATUS_VARIANT, MEETING_METHOD_LABEL,
} from "@/types/meeting";
import { getCurrentUser } from "@/lib/current-user";

type Props = { params: Promise<{ id: string }> };

export default async function MeetingDetailPage({ params }: Props) {
  const { id } = await params;
  const m = await getMeeting(id);
  if (!m) notFound();
  const owner = getMockUser(m.ownerId);
  const user = await getCurrentUser();
  const canEdit =
    user.role === "admin" || user.role === "manager" ||
    (user.role === "member" && m.ownerId === user.id);
  const boundDelete = deleteMeetingAction.bind(null, m.id);

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/meetings"><ArrowLeft className="h-4 w-4" />一覧に戻る</Link>
        </Button>
      </div>
      <PageHeader
        title={m.companyName}
        description={m.contactName ? `${m.contactName} ${m.contactRole && `（${m.contactRole}）`}` : undefined}
        action={
          canEdit ? (
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link href={`/meetings/${m.id}/edit`}><Pencil className="h-4 w-4" />編集</Link>
              </Button>
              <ConfirmDeleteButton label={`${m.companyName} の商談`} onConfirm={boundDelete} />
            </div>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-mint" />商談内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-7 text-ink">{m.content || "（未入力）"}</p>
            </CardContent>
          </Card>
          {m.customerIssue && (
            <Card>
              <CardHeader><CardTitle>顧客課題</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-line text-sm text-ink">{m.customerIssue}</p></CardContent>
            </Card>
          )}
          {m.proposal && (
            <Card>
              <CardHeader><CardTitle>提案内容</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-line text-sm text-ink">{m.proposal}</p></CardContent>
            </Card>
          )}
          {m.nextAction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-mint" />次回アクション
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-ink">{m.nextAction}</p>
                {m.nextMeetingAt && (
                  <p className="mt-3 text-sm text-mint-dark">次回予定：{formatDateTime(m.nextMeetingAt)}</p>
                )}
              </CardContent>
            </Card>
          )}
          {m.minutes && (
            <Card>
              <CardHeader><CardTitle>議事録</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-line text-sm text-ink-soft">{m.minutes}</p></CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>基本情報</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="ステータス">
                <Badge variant={MEETING_STATUS_VARIANT[m.status]}>{MEETING_STATUS_LABEL[m.status]}</Badge>
              </Row>
              <Row label="方法"><Badge variant="outline">{MEETING_METHOD_LABEL[m.method]}</Badge></Row>
              <Row icon={<Calendar className="h-4 w-4" />} label="商談日時">{formatDateTime(m.meetingAt)}</Row>
              {owner && <Row icon={<User className="h-4 w-4" />} label="担当">{owner.name}</Row>}
              {m.budget && <Row label="予算">{m.budget}</Row>}
              <Row label="決裁者">{m.hasDecisionMaker ? "同席" : "未同席"}</Row>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="mt-8">
        <CommentsSection contentType="meeting" contentId={m.id} />
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
