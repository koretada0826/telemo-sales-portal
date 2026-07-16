import type { ID, Visibility } from "./common";

/** 提案構成の1セクション */
export type ProposalSection = {
  id: string; // ローカルID（提案構成内で一意）
  title: string;
  body: string;
};

export type Proposal = {
  id: ID;
  name: string; // 構成名
  productId: ID | null;
  targetIndustry: string;
  targetCustomer: string;
  purpose: string; // 提案目的
  currentState: string; // 現状整理
  issue: string; // 課題
  cause: string; // 原因
  solution: string; // 解決策
  benefit: string; // 導入メリット
  flow: string; // 導入フロー
  pricing: string; // 料金提示
  closing: string; // クロージング
  supplement: string; // 補足
  extraSections: ProposalSection[]; // 追加セクション（並び替え可能）
  tagIds: ID[];
  visibility: Visibility;
  authorId: ID;
  updaterId: ID;
  createdAt: string;
  updatedAt: string;
};

export type ProposalInput = Omit<Proposal, "id" | "authorId" | "updaterId" | "createdAt" | "updatedAt">;
