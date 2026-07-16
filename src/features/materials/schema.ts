import { z } from "zod";

export const materialInputSchema = z.object({
  name: z.string().trim().min(1, "資料名は必須です").max(100),
  description: z.string().max(1000).default(""),
  productId: z.string().nullable(),
  targetIndustry: z.string().max(200).default(""),
  scene: z.string().max(100).default(""),
  fileName: z.string().trim().min(1, "ファイル名は必須です").max(200),
  fileKind: z.enum(["pdf", "pptx", "docx", "xlsx", "image", "other"]),
  fileSizeKb: z.coerce.number().int().nonnegative().max(1024 * 1024, "1GB以下にしてください"),
  fileUrl: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  version: z.string().max(20).default("1.0"),
  visibility: z.enum(["draft", "public", "private"]),
  tagIds: z.array(z.string()).max(10).default([]),
});
export type MaterialFormValues = z.infer<typeof materialInputSchema>;
