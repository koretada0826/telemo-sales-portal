import { z } from "zod";

/** ログインフォーム */
export const loginSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  password: z.string().min(1, "パスワードは必須です"),
});
export type LoginValues = z.infer<typeof loginSchema>;

/** 新規登録フォーム */
export const registerSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  name: z.string().trim().min(1, "氏名は必須です").max(50),
  department: z.string().trim().max(50).default(""),
  password: z
    .string()
    .min(8, "パスワードは8文字以上必要です")
    .max(100)
    .regex(/[A-Za-z]/, "英字を1文字以上含めてください")
    .regex(/[0-9]/, "数字を1文字以上含めてください"),
});
export type RegisterValues = z.infer<typeof registerSchema>;
