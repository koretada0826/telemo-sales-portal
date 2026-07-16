import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MeetingForm } from "@/features/meetings/components/meeting-form";
import { getMeeting } from "@/lib/data-source/meetings";

type Props = { params: Promise<{ id: string }> };

export default async function EditMeetingPage({ params }: Props) {
  const { id } = await params;
  const m = await getMeeting(id);
  if (!m) notFound();
  return (
    <>
      <PageHeader title="商談ログを編集" />
      <MeetingForm meetingId={m.id} defaultValues={{
        companyName: m.companyName, contactName: m.contactName, contactRole: m.contactRole,
        meetingAt: m.meetingAt, method: m.method, status: m.status,
        content: m.content, customerIssue: m.customerIssue, proposal: m.proposal,
        budget: m.budget, hasDecisionMaker: m.hasDecisionMaker,
        nextAction: m.nextAction, nextMeetingAt: m.nextMeetingAt, minutes: m.minutes,
        relatedCallId: m.relatedCallId, tagIds: m.tagIds,
      }} />
    </>
  );
}
