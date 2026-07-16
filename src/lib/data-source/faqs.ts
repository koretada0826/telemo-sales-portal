import "server-only";
import type { Faq, FaqInput } from "@/types/faq";
import type { ListParams, ListResult } from "@/types/common";
import { FAQ_SEEDS } from "@/data/mock/faqs";
import { loadMap, saveMap } from "./persist";

const FILE = "faqs.json";

async function load(): Promise<Map<string, Faq>> {
  return loadMap<Faq>(FILE, () => FAQ_SEEDS);
}

async function persist(map: Map<string, Faq>): Promise<void> {
  return saveMap(FILE, map);
}

function generateId(): string {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 一覧取得（検索・絞込・並び替え・ページング） */
export async function listFaqs(
  params: ListParams & { unansweredOnly?: boolean } = {},
): Promise<ListResult<Faq>> {
  const faqs = await load();
  const { q, categoryId, authorId, unansweredOnly, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(faqs.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter((f) => f.question.toLowerCase().includes(kw) || f.answer.toLowerCase().includes(kw));
  }
  if (categoryId) list = list.filter((f) => f.categoryId === categoryId);
  if (authorId) list = list.filter((f) => f.authorId === authorId);
  if (unansweredOnly) list = list.filter((f) => f.answer.trim().length === 0);
  list.sort((a, b) => {
    switch (sort) {
      case "oldest": return a.createdAt.localeCompare(b.createdAt);
      case "most-viewed": return b.viewCount - a.viewCount;
      case "most-favorited": return b.favoriteCount - a.favoriteCount;
      default: return b.updatedAt.localeCompare(a.updatedAt);
    }
  });
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: list.slice(start, start + perPage), total, page: safePage, perPage, totalPages };
}

export async function getFaq(id: string): Promise<Faq | null> {
  return (await load()).get(id) ?? null;
}

export async function getFaqsByIds(ids: string[]): Promise<Faq[]> {
  const map = await load();
  return ids.map((id) => map.get(id)).filter((f): f is Faq => Boolean(f));
}

export async function createFaq(input: FaqInput, authorId: string): Promise<Faq> {
  const map = await load();
  const now = new Date().toISOString();
  const faq: Faq = {
    id: generateId(), ...input,
    relatedFaqIds: input.relatedFaqIds ?? [],
    attachmentIds: [],
    authorId, updaterId: authorId,
    viewCount: 0, favoriteCount: 0,
    createdAt: now, updatedAt: now,
  };
  map.set(faq.id, faq);
  await persist(map);
  return faq;
}

export async function updateFaq(id: string, input: FaqInput, updaterId: string): Promise<Faq | null> {
  const map = await load();
  const current = map.get(id);
  if (!current) return null;
  const updated: Faq = {
    ...current, ...input,
    relatedFaqIds: input.relatedFaqIds ?? current.relatedFaqIds,
    updaterId, updatedAt: new Date().toISOString(),
  };
  map.set(id, updated);
  await persist(map);
  return updated;
}

export async function deleteFaq(id: string): Promise<boolean> {
  const map = await load();
  const removed = map.delete(id);
  if (removed) await persist(map);
  return removed;
}

export async function incrementFaqView(id: string): Promise<void> {
  const map = await load();
  const current = map.get(id);
  if (!current) return;
  map.set(id, { ...current, viewCount: current.viewCount + 1 });
  await persist(map);
}

export async function countFaqs(): Promise<number> {
  return (await load()).size;
}

export async function countUnansweredFaqs(): Promise<number> {
  const map = await load();
  let n = 0;
  for (const f of map.values()) if (f.answer.trim().length === 0) n++;
  return n;
}

export async function listRecentFaqs(limit: number): Promise<Faq[]> {
  const map = await load();
  return Array.from(map.values())
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}
