import Link from "next/link";
import { Plus, Handshake } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { MeetingCard } from "@/features/meetings/components/meeting-card";
import { MeetingListControls } from "@/features/meetings/components/meeting-list-controls";
import { listMeetings } from "@/lib/data-source/meetings";
import type { MeetingStatus } from "@/types/meeting";

type Props = { searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }> };

export default async function MeetingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listMeetings({
    q: sp.q,
    status: sp.status as MeetingStatus | undefined,
    sort: (sp.sort as "newest" | "oldest") ?? "newest",
    page: Number(sp.page ?? "1"),
    perPage: 10,
  });
  return (
    <>
      <PageHeader
        title="商談ログ"
        description="商談の議事録・ステータス・次回アクションを管理できます。"
        action={
          <Button asChild>
            <Link href="/meetings/new"><Plus className="h-4 w-4" />新規商談を追加</Link>
          </Button>
        }
      />
      <MeetingListControls />
      {result.items.length === 0 ? (
        <EmptyState icon={Handshake} title="商談ログが見つかりません"
          description="検索条件を変えるか、新しい商談を追加してみてください。"
          action={<Button asChild><Link href="/meetings/new"><Plus className="h-4 w-4" />新規商談を追加</Link></Button>} />
      ) : (
        <>
          <div className="space-y-5">
            {result.items.map((m) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
          <Pagination total={result.total} page={result.page} perPage={result.perPage} totalPages={result.totalPages} />
        </>
      )}
    </>
  );
}
