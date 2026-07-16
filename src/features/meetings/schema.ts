import { z } from "zod";

export const meetingInputSchema = z.object({
  companyName: z.string().trim().min(1, "企業名は必須です").max(100),
  contactName: z.string().trim().max(100).default(""),
  contactRole: z.string().trim().max(80).default(""),
  meetingAt: z.string().min(1, "商談日時は必須です"),
  method: z.enum(["online", "visit", "phone", "office"]),
  status: z.enum(["scheduled", "done", "proposing", "considering", "contracted", "lost", "postponed"]),
  content: z.string().max(3000).default(""),
  customerIssue: z.string().max(2000).default(""),
  proposal: z.string().max(3000).default(""),
  budget: z.string().max(100).default(""),
  hasDecisionMaker: z.boolean(),
  nextAction: z.string().max(1000).default(""),
  nextMeetingAt: z.string().nullable(),
  minutes: z.string().max(10000).default(""),
  relatedCallId: z.string().nullable(),
  tagIds: z.array(z.string()).max(10),
});

export type MeetingFormValues = z.infer<typeof meetingInputSchema>;
