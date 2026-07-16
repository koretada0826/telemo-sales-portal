import { PageHeader } from "@/components/layout/page-header";
import { MeetingForm } from "@/features/meetings/components/meeting-form";

export default function NewMeetingPage() {
  return (
    <>
      <PageHeader title="新規商談を追加" description="商談の予定・内容・議事録を記録できます。" />
      <MeetingForm />
    </>
  );
}
