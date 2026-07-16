import { z } from "zod";

export const productInputSchema = z.object({
  productName: z.string().trim().min(1, "商品名は必須です").max(100),
  serviceName: z.string().trim().max(100).default(""),
  overview: z.string().max(3000).default(""),
  targetCustomer: z.string().max(1000).default(""),
  targetIndustry: z.string().max(500).default(""),
  customerIssue: z.string().max(3000).default(""),
  value: z.string().max(3000).default(""),
  features: z.string().max(3000).default(""),
  strengths: z.string().max(3000).default(""),
  pricing: z.string().max(1000).default(""),
  implementationFlow: z.string().max(3000).default(""),
  competitors: z.string().max(1000).default(""),
  competitiveAdvantage: z.string().max(3000).default(""),
  faq: z.string().max(5000).default(""),
  notes: z.string().max(1000).default(""),
  relatedMaterialIds: z.array(z.string()).max(20).default([]),
  tagIds: z.array(z.string()).max(10).default([]),
  visibility: z.enum(["draft", "public", "private"]),
});
export type ProductFormValues = z.infer<typeof productInputSchema>;
