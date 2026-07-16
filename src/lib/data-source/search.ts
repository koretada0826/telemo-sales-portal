import "server-only";

/**
 * 横断検索：全コンテンツからキーワード一致を集めて返す。
 * モック版は各data-sourceのlistXxxを呼んで結合する。
 * 本番はDB側のfull text searchに置き換え。
 */

import { listFaqs } from "./faqs";
import { listScripts } from "./scripts";
import { listMeetings } from "./meetings";
import { listProducts } from "./products";
import { listMaterials } from "./materials";
import { listProposals } from "./proposals";
import { truncate } from "@/lib/utils/format";

export type SearchResultType =
  | "faq" | "script" | "meeting" | "product" | "material" | "proposal";

export type SearchResultItem = {
  type: SearchResultType;
  id: string;
  title: string;
  excerpt: string;
  href: string;
  updatedAt: string;
};

/** 全コンテンツ横断検索 */
export async function crossSearch(q: string, typeFilter?: SearchResultType): Promise<SearchResultItem[]> {
  if (!q.trim()) return [];

  const [faqs, scripts, meetings, products, materials, proposals] = await Promise.all([
    listFaqs({ q, perPage: 100 }),
    listScripts({ q, perPage: 100 }),
    listMeetings({ q, perPage: 100 }),
    listProducts({ q, perPage: 100 }),
    listMaterials({ q, perPage: 100 }),
    listProposals({ q, perPage: 100 }),
  ]);

  const items: SearchResultItem[] = [
    ...faqs.items.map<SearchResultItem>((f) => ({
      type: "faq", id: f.id, title: f.question, excerpt: truncate(f.answer || "(未回答)", 100),
      href: `/knowledge/faqs/${f.id}`, updatedAt: f.updatedAt,
    })),
    ...scripts.items.map<SearchResultItem>((s) => ({
      type: "script", id: s.id, title: s.name, excerpt: truncate(s.opening || s.productPitch, 100),
      href: `/training/scripts/${s.id}`, updatedAt: s.updatedAt,
    })),
    ...meetings.items.map<SearchResultItem>((m) => ({
      type: "meeting", id: m.id, title: `${m.companyName} / ${m.contactName}`,
      excerpt: truncate(m.content, 100),
      href: `/meetings/${m.id}`, updatedAt: m.updatedAt,
    })),
    ...products.items.map<SearchResultItem>((p) => ({
      type: "product", id: p.id, title: p.productName,
      excerpt: truncate(p.overview, 100),
      href: `/sales/products/${p.id}`, updatedAt: p.updatedAt,
    })),
    ...materials.items.map<SearchResultItem>((mt) => ({
      type: "material", id: mt.id, title: mt.name,
      excerpt: truncate(mt.description, 100),
      href: `/sales/materials/${mt.id}`, updatedAt: mt.updatedAt,
    })),
    ...proposals.items.map<SearchResultItem>((pr) => ({
      type: "proposal", id: pr.id, title: pr.name,
      excerpt: truncate(pr.purpose, 100),
      href: `/sales/proposals/${pr.id}`, updatedAt: pr.updatedAt,
    })),
  ];

  const filtered = typeFilter ? items.filter((i) => i.type === typeFilter) : items;
  return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
