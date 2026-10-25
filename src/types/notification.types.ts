export interface AppNotification {
  id: string;
  type: string;
  category: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  priority: string;
  isRead: boolean;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationsListData {
  notifications: AppNotification[];
  unreadCount: number;
}

export type NotificationFilter =
  | "all"
  | "booking"
  | "payment"
  | "refund"
  | "verification"
  | "reminder"
  | "promotion"
  | "security"
  | "support"
  | "review"
  | "trust_score";
