export interface HostBadge {
  badgeType: string;
  awardedAt: string;
}

export interface HostSocialLinks {
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
}

export interface HostPublicProfile {
  slug: string;
  displayName: string;
  bio: string | null;
  about: string | null;
  occupation: string | null;
  languages: string[];
  interests: string[];
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  hostRating: number;
  totalReviews: number;
  completedEvents: number;
  responseTime: number | null;
  badges: HostBadge[];
  socialLinks: HostSocialLinks;
  isVerified: boolean;
  galleryUrls: string[];
  trustScore: number | null;
  isPreview?: boolean;
}

export interface HostAddress {
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface HostEmergencyContact {
  name: string;
  phone: string;
}

export interface HostStatistics {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  followers: number;
  averageRating: number;
  responseRate: number;
  responseTime: number | null;
  totalReviews: number;
  totalGuests: number;
  revenuePlaceholder: number;
}

export interface HostActivity {
  id: string;
  activityType: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface HostDashboard {
  statistics: HostStatistics;
  profileCompletion: number;
  verificationStatus: string;
  accountStatus: string;
  pendingTasks: string[];
  recentActivity: HostActivity[];
  upcomingEventsPlaceholder: number;
}

export interface HostAnalytics extends HostStatistics {
  cancellationRate: number;
  attendance: number;
  earnings: number;
}

export interface HostPrivateProfile extends HostPublicProfile {
  id: string;
  userId: string;
  accountStatus: string;
  verificationStatus: string;
  hostingExperience: string | null;
  emergencyContact: HostEmergencyContact | null;
  address: HostAddress | null;
  profileCompletion: number | null;
  hostSince: string | null;
  organizationId: string | null;
}
