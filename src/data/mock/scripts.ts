import type { Script } from "@/types/script";

/** トークスクリプトのシードデータ */
export const SCRIPT_SEEDS: Script[] = [
  {
    id: "sc-001",
    name: "SaaS新規開拓 - 受付突破",
    productId: null,
    industry: "IT・SaaS",
    scene: "reception",
    opening:
      "お世話になっております、株式会社◯◯の△△と申します。\n人事DXの件でご担当者様におつなぎいただけますでしょうか。",
    hearing: "・現状の課題感\n・利用中ツールの有無\n・意思決定者の把握",
    problemRaise:
      "多くの企業様では、人事情報が複数ツールに散在しており、月次集計に平均10時間以上かかっているとの声をいただきます。",
    productPitch:
      "弊社サービスは、既存ツール(SmartHR・freee等)と自動連携し、レポート作成を自動化します。",
    closing:
      "15分程度で概要をご説明できるお時間を来週いただけますでしょうか。",
    objectionHandling:
      "「今は間に合っている」→ ですよね。今すぐの導入というより、来期のご検討材料として15分だけお時間いただけませんか。",
    notes: "架電時間は10:00〜11:30、14:00〜16:30がベスト。",
    tagIds: ["tag-training"],
    visibility: "public",
    authorId: "user-002",
    updaterId: "user-002",
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-07-10T14:00:00Z",
  },
  {
    id: "sc-002",
    name: "資料送付後フォロー",
    productId: null,
    industry: "全業種",
    scene: "post-doc",
    opening:
      "先日資料をお送りした株式会社◯◯の△△です。ご一読いただけましたでしょうか。",
    hearing: "・資料の中で気になった点\n・社内での共有状況",
    problemRaise:
      "資料ではお伝えしきれない、御社の課題に沿った具体的な事例をご紹介できます。",
    productPitch: "貴社と同業界の導入事例を、30分ほどでご説明できます。",
    closing: "来週火曜or木曜のご都合はいかがでしょうか。",
    objectionHandling:
      "「まだ読めていない」→ お忙しいですよね。要点を3分でお伝えしますので、その上で判断いただけますか。",
    notes: "資料送付から3営業日以内にコールすること。",
    tagIds: ["tag-training", "tag-onboarding"],
    visibility: "public",
    authorId: "user-003",
    updaterId: "user-003",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-07-08T11:20:00Z",
  },
  {
    id: "sc-003",
    name: "クロージング - 決裁者向け",
    productId: null,
    industry: "全業種",
    scene: "closing",
    opening:
      "お忙しいところありがとうございます。本日は最終確認のお電話です。",
    hearing:
      "・稟議の進捗\n・懸念事項\n・導入希望時期",
    problemRaise: "早期に開始いただくことで◯月時点の効果が変わります。",
    productPitch:
      "3か月導入プランでは、初月費用を50%OFFとする限定プランもございます。",
    closing:
      "本日中にお申込書をお送りしますので、ご捺印をお願いできますでしょうか。",
    objectionHandling:
      "「もう少し検討時間が欲しい」→ 承知しました。次回のお打ち合わせを◯日に設定させてください。",
    notes:
      "決裁者と直接話せている前提。安易な値引きはせず、期限効果で締める。",
    tagIds: ["tag-training"],
    visibility: "public",
    authorId: "dummy-admin-001",
    updaterId: "dummy-admin-001",
    createdAt: "2026-06-05T13:00:00Z",
    updatedAt: "2026-07-12T09:30:00Z",
  },
];
