export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
}

export interface EventHostSummary {
  slug: string;
  displayName: string;
  isVerified: boolean;
  profileImageUrl?: string | null;
  hostRating?: number;
}

export interface EventAvailability {
  capacity: number;
  remaining: number;
  isOpen: boolean;
}

export interface EventListItem {
  id: string;
  eventId: string;
  slug: string;
  hostId: string;
  bookingRequired: boolean;
  capacity: number;
  availability: EventAvailability;
  title: string;
  shortDescription: string | null;
  status: string;
  price: number;
  currency: string;
  eventStart: string;
  eventEnd: string;
  city: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  host: EventHostSummary;
  category: Pick<EventCategory, "name" | "slug">;
}

export interface EventsListData {
  items: EventListItem[];
}

export interface CategoriesListData {
  categories: EventCategory[];
}

export interface EventLocation {
  venueName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId?: string | null;
  mapUrl?: string | null;
  isPrivateAddress?: boolean;
}

export interface EventMedia {
  id: string;
  mediaType: string;
  url: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  isCover: boolean;
}

export interface EventRule {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
}

export interface EventTag {
  id: string;
  name: string;
  slug: string;
}

export interface EventDetail {
  id: string;
  eventId: string;
  slug: string;
  hostId: string;
  bookingRequired: boolean;
  capacity: number;
  availability: EventAvailability;
  title: string;
  description: string;
  shortDescription: string | null;
  status: string;
  visibility: string;
  approvalRequired: boolean;
  minimumAge: number | null;
  maximumAge: number | null;
  language: string | null;
  remainingCapacity: number;
  price: number;
  currency: string;
  bookingStart: string;
  bookingEnd: string;
  eventStart: string;
  eventEnd: string;
  dressCode: string | null;
  foodProvided: boolean;
  parkingAvailable: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  amenities: string[];
  timezone: string;
  isFeatured: boolean;
  isTrending: boolean;
  category: EventCategory;
  host: EventHostSummary;
  location: EventLocation | null;
  media: EventMedia[];
  rules: EventRule[];
  tags: EventTag[];
  isPreview?: boolean;
}

export interface EventDetailData {
  event: EventDetail;
}

export interface EventPrivate extends EventDetail {
  id: string;
  hostId: string;
  categoryId: string;
  cancelReason: string | null;
  rejectionReason: string | null;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventResponse {
  eventId: string;
  slug: string;
  event: EventPrivate;
}

export interface HostEventsListData {
  items: EventListItem[];
}

export interface EventSearchParams {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  priceType?: "free" | "paid";
  date?: string;
  verifiedHost?: boolean;
  search?: string;
  keyword?: string;
  sort?: "newest" | "nearest" | "trending" | "rating" | "price_asc" | "price_desc";
}
