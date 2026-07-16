import type { MeetingLog } from "@/types/meeting";

export const MEETING_SEEDS: MeetingLog[] = [
  {
    id: "mtg-example",
    companyName: "【例】株式会社サンプル",
    contactName: "山田 部長",
    contactRole: "営業部長",
    ownerId: "usr-admin",
    meetingAt: "2026-07-20T05:00:00Z",
    method: "online",
    status: "scheduled",
    content: "初回商談。サービス概要と課題ヒアリング。",
    customerIssue: "属人化した営業ノウハウの標準化",
    proposal: "スタンダードプラン + 導入支援",
    budget: "月額20万円前後",
    hasDecisionMaker: true,
    nextAction: "商談前日にリマインドメール送付",
    nextMeetingAt: null,
    minutes: "",
    relatedCallId: null,
    tagIds: [],
    createdAt: "2026-07-16T00:00:00Z",
    updatedAt: "2026-07-16T00:00:00Z",
  },
];
