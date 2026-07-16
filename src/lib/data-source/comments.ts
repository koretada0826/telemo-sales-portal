import "server-only";
import type { Comment, CommentContentType, CommentInput } from "@/types/comment";
import { COMMENT_SEEDS } from "@/data/mock/comments";
import { loadMap, saveMap } from "./persist";

const FILE = "comments.json";
const load = () => loadMap<Comment>(FILE, () => COMMENT_SEEDS);
const persist = (m: Map<string, Comment>) => saveMap(FILE, m);
const genId = () => `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listComments(contentType: CommentContentType, contentId: string): Promise<Comment[]> {
  const map = await load();
  return Array.from(map.values())
    .filter((c) => c.contentType === contentType && c.contentId === contentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function countComments(contentType: CommentContentType, contentId: string): Promise<number> {
  const map = await load();
  let n = 0;
  for (const c of map.values()) if (c.contentType === contentType && c.contentId === contentId) n++;
  return n;
}

export async function createComment(input: CommentInput, authorId: string): Promise<Comment> {
  const map = await load();
  const now = new Date().toISOString();
  const c: Comment = {
    id: genId(),
    contentType: input.contentType,
    contentId: input.contentId,
    parentId: input.parentId ?? null,
    body: input.body,
    authorId,
    mentionUserIds: [],
    createdAt: now,
    updatedAt: now,
  };
  map.set(c.id, c);
  await persist(map);
  return c;
}

export async function updateComment(id: string, body: string): Promise<Comment | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, body, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function getComment(id: string): Promise<Comment | null> {
  return (await load()).get(id) ?? null;
}

export async function deleteComment(id: string): Promise<boolean> {
  const map = await load();
  const removed = map.delete(id);
  // 返信も削除
  for (const [cid, c] of map) if (c.parentId === id) map.delete(cid);
  if (removed) await persist(map);
  return removed;
}
