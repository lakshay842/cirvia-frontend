export interface SavedEvent {
  id: string;
  eventId: string;
  title: string;
  slug: string;
  eventStart: string;
  savedAt: string;
}

export interface SavedEventsListData {
  events: SavedEvent[];
}

export interface RecentlyViewedEntry {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  city: string | null;
  eventStart: string;
  viewedAt: string;
}
