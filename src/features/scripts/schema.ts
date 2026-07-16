import { z } from "zod";

/** トークスクリプトのZodスキーマ */
export const scriptInputSchema = z.object({
  name: z.string().trim().min(1, "スクリプト名は必須です").max(100),
  productId: z.string().nullable(),
  industry: z.string().trim().max(80).default(""),
  scene: z.enum([
    "reception",
    "connect",
    "appointment",
    "callback",
    "post-doc",
    "recall",
    "closing",
    "complaint",
  ]),
  opening: z.string().max(2000).default(""),
  hearing: z.string().max(2000).default(""),
  problemRaise: z.string().max(2000).default(""),
  productPitch: z.string().max(2000).default(""),
  closing: z.string().max(2000).default(""),
  objectionHandling: z.string().max(2000).default(""),
  notes: z.string().max(1000).default(""),
  tagIds: z.array(z.string()).max(10),
  visibility: z.enum(["draft", "public", "private"]),
});

export type ScriptFormValues = z.infer<typeof scriptInputSchema>;
