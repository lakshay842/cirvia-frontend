export interface BookingEventSummary {
  eventId: string;
  title: string;
  slug: string;
  eventStart: string;
  eventEnd: string;
  city: string | null;
  venueName: string | null;
}

export interface BookingSummary {
  bookingId: string;
  bookingReference: string;
  status: string;
  paymentStatus: string;
  guestsCount: number;
  ticketPrice: number;
  currency: string;
  event: BookingEventSummary;
  createdAt: string;
  expiresAt?: string;
}

export interface HostBookingGuest {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  isVerifiedHost: boolean;
  hostAccountStatus: string | null;
  hostVerificationStatus: string | null;
}

export interface HostBookingSummary extends BookingSummary {
  guest: HostBookingGuest;
}

export interface BookingAttendee {
  attendeeId: string;
  guestName: string;
  checkedIn: boolean;
  checkedOut: boolean;
}

export interface BookingDetails extends BookingSummary {
  ticketType: string;
  approvalStatus: string | null;
  approvedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  cancelReason: string | null;
  rejectionReason: string | null;
  host: { hostId: string; displayName: string };
  attendees: BookingAttendee[];
  updatedAt: string;
}

export interface BookingsListData {
  bookings: BookingSummary[];
}

export interface BookingStatusData {
  bookingId: string;
  status: string;
  paymentStatus: string;
  expiresAt: string | null;
}

export interface BookingTimelineItem {
  id: string;
  action: string;
  metadata: unknown;
  actorId: string | null;
  createdAt: string;
}

export interface BookingQrData {
  bookingId: string;
  qrCode: string | null;
  note: string;
}

export interface CreateBookingPayload {
  eventId: string;
  ticketQuantity: number;
  couponCode?: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  bookingReference: string;
  status: string;
  expiresAt?: string;
  payment?: unknown;
}

export type BookingFilter = "upcoming" | "past" | "cancelled" | "pending" | "confirmed" | "all";
