import { z } from "zod";

/** ログインフォーム（名前 + パスワード） */
export const loginSchema = z.object({
  name: z.string().trim().min(1, "ユーザー名を入力してください").max(50),
  password: z.string().min(1, "パスワードを入力してください"),
});
export type LoginValues = z.infer<typeof loginSchema>;

/** 新規登録フォーム（管理者による追加用） */
export const registerSchema = z.object({
  name: z.string().trim().min(1, "氏名は必須です").max(50),
  email: z.string().trim().email("メールアドレスの形式が不正です").optional().or(z.literal("")),
  department: z.string().trim().max(50).default(""),
  password: z.string().min(4, "パスワードは4文字以上必要です").max(100),
});
export type RegisterValues = z.infer<typeof registerSchema>;
