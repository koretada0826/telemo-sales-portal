import type { ID } from "./common";

export type MeetingMethod = "online" | "visit" | "phone" | "office";
export const MEETING_METHOD_LABEL: Record<MeetingMethod, string> = {
  online: "オンライン", visit: "訪問", phone: "電話", office: "来社",
};

export type MeetingStatus =
  | "scheduled" | "done" | "proposing" | "considering"
  | "contracted" | "lost" | "postponed";

export const MEETING_STATUS_LABEL: Record<MeetingStatus, string> = {
  scheduled: "予定", done: "実施済み", proposing: "提案中",
  considering: "検討中", contracted: "契約", lost: "失注", postponed: "延期",
};

export const MEETING_STATUS_VARIANT: Record<MeetingStatus, "gray" | "success" | "mint" | "warning" | "danger"> = {
  scheduled: "gray", done: "mint", proposing: "warning",
  considering: "warning", contracted: "success", lost: "danger", postponed: "gray",
};

export type MeetingLog = {
  id: ID;
  companyName: string;
  contactName: string;
  contactRole: string; // 役職
  ownerId: ID; // 商談担当者
  meetingAt: string;
  method: MeetingMethod;
  status: MeetingStatus;
  content: string;
  customerIssue: string; // 顧客課題
  proposal: string; // 提案内容
  budget: string; // 予算（自由入力）
  hasDecisionMaker: boolean; // 決裁者の有無
  nextAction: string;
  nextMeetingAt: string | null;
  minutes: string; // 議事録
  relatedCallId: ID | null;
  tagIds: ID[];
  createdAt: string;
  updatedAt: string;
};

export type MeetingLogInput = Omit<MeetingLog, "id" | "ownerId" | "createdAt" | "updatedAt">;
