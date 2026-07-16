import Link from "next/link";
import { ArrowRight, Calendar, Handshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attribution } from "@/components/ui/attribution";
import type { MeetingLog } from "@/types/meeting";
import { MEETING_STATUS_LABEL, MEETING_STATUS_VARIANT, MEETING_METHOD_LABEL } from "@/types/meeting";
import { formatDateTime } from "@/lib/utils/format";

export function MeetingCard({ meeting }: { meeting: MeetingLog }) {
  return (
    <Card className="p-0">
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-ink sm:text-lg">{meeting.companyName}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {meeting.contactName} {meeting.contactRole && `（${meeting.contactRole}）`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={MEETING_STATUS_VARIANT[meeting.status]}>
              {MEETING_STATUS_LABEL[meeting.status]}
            </Badge>
            <Badge variant="outline">{MEETING_METHOD_LABEL[meeting.method]}</Badge>
          </div>
        </div>

        <p className="mt-4 text-sm text-ink-soft clamp-2">{meeting.content}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(meeting.meetingAt)}
          </span>
          {/* 商談担当を「作成」ラベルで表示（Meetingは authorId 相当が ownerId） */}
          <Attribution authorId={meeting.ownerId} />
          {meeting.hasDecisionMaker && (
            <span className="inline-flex items-center gap-1 text-xs text-mint-dark">
              <Handshake className="h-3.5 w-3.5" />
              決裁者同席
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-line bg-mint-softer/40 px-4 py-3 sm:px-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/meetings/${meeting.id}`}>詳細を見る<ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </Card>
  );
}
