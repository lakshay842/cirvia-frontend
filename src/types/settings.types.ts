export interface PrivacySettings {
  profileVisibility: string;
  activityVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  showLastSeen: boolean;
  allowFollowRequests: boolean;
  showTrustScore: boolean;
  showActivityFeed: boolean;
}

export interface AccountSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  twoFactorEnabled: boolean;
  marketingOptIn: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  security: boolean;
  booking: boolean;
  review: boolean;
}

export interface UserSettings {
  privacy: PrivacySettings;
  account: AccountSettings;
  notifications: NotificationSettings;
}
