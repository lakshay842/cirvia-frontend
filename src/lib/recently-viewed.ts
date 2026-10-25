import type { RecentlyViewedEntry } from "@/types/saved-event.types";

const STORAGE_KEY = "cirvia_recently_viewed";
const MAX_ITEMS = 20;

function readAll(): RecentlyViewedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentlyViewedEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: RecentlyViewedEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ITEMS)));
}

export function addRecentlyViewed(entry: Omit<RecentlyViewedEntry, "viewedAt">): void {
  const now = new Date().toISOString();
  const existing = readAll().filter((e) => e.slug !== entry.slug);
  writeAll([{ ...entry, viewedAt: now }, ...existing]);
}

export function getRecentlyViewed(): RecentlyViewedEntry[] {
  return readAll();
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
