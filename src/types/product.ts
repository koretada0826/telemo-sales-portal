import type { ID, Visibility } from "./common";

export type Product = {
  id: ID;
  productName: string;
  serviceName: string;
  overview: string; // 概要
  targetCustomer: string; // 対象顧客
  targetIndustry: string; // 対象業界
  customerIssue: string; // 顧客課題
  value: string; // 提供価値
  features: string; // 機能
  strengths: string; // 特徴
  pricing: string; // 料金
  implementationFlow: string; // 導入までの流れ
  competitors: string; // 競合
  competitiveAdvantage: string; // 競合優位性
  faq: string; // よくある質問
  notes: string; // 注意事項
  relatedMaterialIds: ID[];
  tagIds: ID[];
  visibility: Visibility;
  authorId: ID;
  updaterId: ID;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "authorId" | "updaterId" | "createdAt" | "updatedAt">;
