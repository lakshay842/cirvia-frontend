export const QUERY_KEYS = {
  events: {
    all: ["events"] as const,
    featured: (limit?: number) => ["events", "featured", limit] as const,
    trending: (limit?: number) => ["events", "trending", limit] as const,
    list: (params?: Record<string, unknown>) => ["events", "list", params] as const,
    search: (params?: Record<string, unknown>) => ["events", "search", params] as const,
    detail: (slug: string) => ["events", "detail", slug] as const,
    hostDetail: (eventId: string) => ["events", "host-detail", eventId] as const,
    hostList: (params?: Record<string, unknown>) => ["events", "host", params] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (slug: string) => ["categories", slug] as const,
  },
  users: {
    me: ["users", "me"] as const,
    savedEvents: ["users", "saved-events"] as const,
    recentlyViewed: (slugs: string[]) => ["users", "recently-viewed", slugs] as const,
  },
  hosts: {
    detail: (slug: string) => ["hosts", slug] as const,
    me: ["hosts", "me"] as const,
    dashboard: ["hosts", "dashboard"] as const,
    analytics: ["hosts", "analytics"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (filter?: string) => ["bookings", "list", filter] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
    status: (id: string) => ["bookings", "status", id] as const,
    timeline: (id: string) => ["bookings", "timeline", id] as const,
    qr: (id: string) => ["bookings", "qr", id] as const,
    hostList: (params?: Record<string, unknown>) => ["bookings", "host", params] as const,
  },
  payments: {
    list: (params?: Record<string, unknown>) => ["payments", "list", params] as const,
    detail: (id: string) => ["payments", "detail", id] as const,
  },
  wallet: {
    summary: ["wallet", "summary"] as const,
    transactions: (params?: Record<string, unknown>) => ["wallet", "transactions", params] as const,
    withdrawals: (params?: Record<string, unknown>) => ["wallet", "withdrawals", params] as const,
    bankAccounts: ["wallet", "bank-accounts"] as const,
  },
  settings: {
    all: ["settings"] as const,
    notifications: ["settings", "notifications"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params?: Record<string, unknown>) => ["notifications", "list", params] as const,
    unreadCount: ["notifications", "unread-count"] as const,
    preferences: ["notifications", "preferences"] as const,
  },
  verification: {
    status: ["verification", "status"] as const,
    details: ["verification", "details"] as const,
  },
  contact: {
    submit: ["contact", "submit"] as const,
  },
  newsletter: {
    subscribe: ["newsletter", "subscribe"] as const,
  },
} as const;
