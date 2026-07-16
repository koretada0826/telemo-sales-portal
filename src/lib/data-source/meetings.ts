import "server-only";
import type { MeetingLog, MeetingLogInput, MeetingStatus } from "@/types/meeting";
import type { ListParams, ListResult } from "@/types/common";
import { MEETING_SEEDS } from "@/data/mock/meetings";
import { loadMap, saveMap } from "./persist";

const FILE = "meetings.json";
const load = () => loadMap<MeetingLog>(FILE, () => MEETING_SEEDS);
const persist = (m: Map<string, MeetingLog>) => saveMap(FILE, m);
const genId = () => `mtg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listMeetings(
  params: ListParams & { status?: MeetingStatus } = {},
): Promise<ListResult<MeetingLog>> {
  const map = await load();
  const { q, status, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(map.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter(
      (m) =>
        m.companyName.toLowerCase().includes(kw) ||
        m.contactName.toLowerCase().includes(kw) ||
        m.content.toLowerCase().includes(kw),
    );
  }
  if (status) list = list.filter((m) => m.status === status);
  list.sort((a, b) =>
    sort === "oldest" ? a.meetingAt.localeCompare(b.meetingAt) : b.meetingAt.localeCompare(a.meetingAt),
  );
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: list.slice(start, start + perPage), total, page: safePage, perPage, totalPages };
}

export async function getMeeting(id: string): Promise<MeetingLog | null> {
  return (await load()).get(id) ?? null;
}

export async function createMeeting(input: MeetingLogInput, ownerId: string): Promise<MeetingLog> {
  const map = await load();
  const now = new Date().toISOString();
  const m: MeetingLog = { id: genId(), ...input, ownerId, createdAt: now, updatedAt: now };
  map.set(m.id, m);
  await persist(map);
  return m;
}

export async function updateMeeting(id: string, input: MeetingLogInput): Promise<MeetingLog | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, ...input, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteMeeting(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}

export async function countMeetings(): Promise<number> {
  return (await load()).size;
}

export async function countMeetingsThisMonth(): Promise<number> {
  const map = await load();
  const now = new Date();
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return Array.from(map.values()).filter((m) => m.meetingAt.startsWith(ym)).length;
}

export async function listUpcomingMeetings(limit: number): Promise<MeetingLog[]> {
  const map = await load();
  const now = new Date().toISOString();
  return Array.from(map.values())
    .filter((m) => m.meetingAt >= now)
    .sort((a, b) => a.meetingAt.localeCompare(b.meetingAt))
    .slice(0, limit);
}
