import Link from "next/link";
import {
  Bell, MessageCircle, AtSign, PlusCircle, RefreshCw, Clock, Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/current-user";
import { listNotifications } from "@/lib/data-source/notifications";
import { formatRelative } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { NotificationType } from "@/types/notification";
import { MarkReadButton } from "@/features/notifications/components/mark-read-button";

const TYPE_META: Record<NotificationType, { icon: LucideIcon; label: string; color: string }> = {
  comment: { icon: MessageCircle, label: "コメント", color: "text-mint-dark" },
  mention: { icon: AtSign, label: "メンション", color: "text-warning" },
  "new-content": { icon: PlusCircle, label: "新規投稿", color: "text-mint" },
  "content-updated": { icon: RefreshCw, label: "更新", color: "text-ink-soft" },
  reminder: { icon: Clock, label: "リマインド", color: "text-warning" },
  system: { icon: Info, label: "システム", color: "text-ink-soft" },
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const list = await listNotifications(user.id);
  const unread = list.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="通知一覧"
        description={unread > 0 ? `未読が ${unread} 件あります。` : "未読の通知はありません。"}
        action={unread > 0 ? <MarkReadButton all /> : null}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="通知はまだありません"
          description="コメント・メンション・新規投稿があるとここに表示されます。"
        />
      ) : (
        <div className="space-y-3">
          {list.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <Card
                key={n.id}
                className={cn(
                  "p-0",
                  !n.read && "ring-2 ring-mint/30",
                )}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-softer", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="gray">{meta.label}</Badge>
                      {!n.read && <Badge variant="warning">未読</Badge>}
                      <span className="text-xs text-ink-soft">{formatRelative(n.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-ink">{n.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{n.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.linkUrl && (
                        <Link
                          href={n.linkUrl}
                          className="inline-flex items-center gap-1 rounded-btn bg-mint px-2.5 py-1.5 text-xs font-medium text-white hover:bg-mint-dark"
                        >
                          対象を見る
                        </Link>
                      )}
                      {!n.read && <MarkReadButton id={n.id} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
