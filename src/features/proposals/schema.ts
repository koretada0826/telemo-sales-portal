import { z } from "zod";

export const proposalSectionSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  body: z.string().max(3000),
});

export const proposalInputSchema = z.object({
  name: z.string().trim().min(1, "構成名は必須です").max(100),
  productId: z.string().nullable(),
  targetIndustry: z.string().max(200).default(""),
  targetCustomer: z.string().max(200).default(""),
  purpose: z.string().max(3000).default(""),
  currentState: z.string().max(3000).default(""),
  issue: z.string().max(3000).default(""),
  cause: z.string().max(3000).default(""),
  solution: z.string().max(3000).default(""),
  benefit: z.string().max(3000).default(""),
  flow: z.string().max(3000).default(""),
  pricing: z.string().max(3000).default(""),
  closing: z.string().max(3000).default(""),
  supplement: z.string().max(3000).default(""),
  extraSections: z.array(proposalSectionSchema).max(20).default([]),
  tagIds: z.array(z.string()).max(10).default([]),
  visibility: z.enum(["draft", "public", "private"]),
});
export type ProposalFormValues = z.infer<typeof proposalInputSchema>;
