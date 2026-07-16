import "server-only";
import type { Proposal, ProposalInput } from "@/types/proposal";
import type { ListParams, ListResult } from "@/types/common";
import { PROPOSAL_SEEDS } from "@/data/mock/proposals";
import { loadMap, saveMap } from "./persist";

const FILE = "proposals.json";
const load = () => loadMap<Proposal>(FILE, () => PROPOSAL_SEEDS);
const persist = (m: Map<string, Proposal>) => saveMap(FILE, m);
const genId = () => `prp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listProposals(params: ListParams = {}): Promise<ListResult<Proposal>> {
  const map = await load();
  const { q, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(map.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.purpose, p.solution].some((v) => v.toLowerCase().includes(kw)),
    );
  }
  list.sort((a, b) =>
    sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.updatedAt.localeCompare(a.updatedAt),
  );
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: list.slice(start, start + perPage), total, page: safePage, perPage, totalPages };
}

export async function getProposal(id: string): Promise<Proposal | null> {
  return (await load()).get(id) ?? null;
}

export async function createProposal(input: ProposalInput, authorId: string): Promise<Proposal> {
  const map = await load();
  const now = new Date().toISOString();
  const p: Proposal = { id: genId(), ...input, authorId, updaterId: authorId, createdAt: now, updatedAt: now };
  map.set(p.id, p);
  await persist(map);
  return p;
}

export async function updateProposal(id: string, input: ProposalInput, updaterId: string): Promise<Proposal | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, ...input, updaterId, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteProposal(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}

export async function countProposals(): Promise<number> {
  return (await load()).size;
}
