import { get, patch, post } from "@/lib/api";
import type {
  BookingDetails,
  BookingFilter,
  BookingQrData,
  BookingStatusData,
  BookingsListData,
  BookingTimelineItem,
  CreateBookingPayload,
  CreateBookingResponse,
} from "@/types/booking.types";
import type { ApiMeta } from "@/types/api.types";

export const bookingService = {
  create: (body: CreateBookingPayload) =>
    post<CreateBookingResponse>("/bookings", body),

  list: (params?: { status?: BookingFilter; page?: number; limit?: number }) =>
    get<BookingsListData>("/bookings", params as Record<string, unknown>),

  getDetails: (bookingId: string) =>
    get<{ booking: BookingDetails }>(`/bookings/${bookingId}`),

  getStatus: (bookingId: string) =>
    get<BookingStatusData>(`/bookings/${bookingId}/status`),

  getTimeline: (bookingId: string) =>
    get<{ timeline: BookingTimelineItem[] }>(`/bookings/${bookingId}/timeline`),

  getQr: (bookingId: string) =>
    get<BookingQrData>(`/bookings/${bookingId}/qr`),

  cancel: (bookingId: string, reason: string) =>
    patch<{ booking: BookingDetails }>(`/bookings/${bookingId}/cancel`, { reason }),
};

export const hostBookingService = {
  list: (params?: { status?: string; eventId?: string; page?: number; limit?: number }) =>
    get<{ bookings: import("@/types/booking.types").HostBookingSummary[]; meta?: ApiMeta }>(
      "/hosts/bookings",
      params as Record<string, unknown>,
    ),

  approve: (bookingId: string) =>
    patch<{ booking: BookingDetails }>(`/hosts/bookings/${bookingId}/approve`),

  reject: (bookingId: string, reason: string) =>
    patch<{ booking: BookingDetails }>(`/hosts/bookings/${bookingId}/reject`, { reason }),
};
