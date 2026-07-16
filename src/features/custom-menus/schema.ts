import { z } from "zod";

export const customMenuSchema = z.object({
  name: z.string().trim().min(1, "メニュー名は必須です").max(30),
  icon: z.enum([
    "book", "message", "chart", "target", "award",
    "briefcase", "package", "file", "star", "flag", "megaphone",
  ]),
  href: z.string().trim().min(1, "遷移先URLは必須です").max(200),
  group: z.enum(["training", "sales", "personal"]),
  order: z.coerce.number().int().min(0).max(9999),
  isPublished: z.boolean(),
  viewableRoles: z.array(z.enum(["admin", "manager", "member", "viewer"])).min(1, "1つ以上選択してください"),
});
export type CustomMenuFormValues = z.infer<typeof customMenuSchema>;
