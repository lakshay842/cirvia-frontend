const STORAGE_KEY = "cirvia_event_ids";

type Registry = Record<string, string>;

function readRegistry(): Registry {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Registry) : {};
  } catch {
    return {};
  }
}

function writeRegistry(registry: Registry): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

export function registerEventId(slug: string, eventId: string): void {
  const registry = readRegistry();
  registry[slug] = eventId;
  writeRegistry(registry);
}

export function getRegisteredEventId(slug: string): string | null {
  return readRegistry()[slug] ?? null;
}

export function registerEventIds(entries: Array<{ slug: string; eventId: string }>): void {
  const registry = readRegistry();
  for (const { slug, eventId } of entries) {
    registry[slug] = eventId;
  }
  writeRegistry(registry);
}
