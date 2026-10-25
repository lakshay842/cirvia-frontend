import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getRegisteredEventId, registerEventId } from "@/lib/event-id-registry";
import { bookingService } from "@/services/booking.service";
import { useAuthStore } from "@/stores/auth-store";
import type { BookingFilter, CreateBookingPayload } from "@/types/booking.types";

export function useBookings(filter: BookingFilter = "all") {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.bookings.list(filter),
    queryFn: async () => {
      const res = await bookingService.list({ status: filter, limit: 50 });
      return res.data.bookings;
    },
    enabled: isAuthenticated,
  });
}

export function useBookingDetails(bookingId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.detail(bookingId),
    queryFn: async () => {
      const res = await bookingService.getDetails(bookingId);
      return res.data.booking;
    },
    enabled: Boolean(bookingId),
  });
}

export function useBookingStatus(bookingId: string, poll = false) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.status(bookingId),
    queryFn: async () => bookingService.getStatus(bookingId).then((r) => r.data),
    enabled: Boolean(bookingId),
    refetchInterval: poll ? 5000 : false,
  });
}

export function useBookingTimeline(bookingId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.timeline(bookingId),
    queryFn: async () => {
      const res = await bookingService.getTimeline(bookingId);
      return res.data.timeline;
    },
    enabled: Boolean(bookingId),
  });
}

export function useBookingQr(bookingId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.bookings.qr(bookingId),
    queryFn: async () => bookingService.getQr(bookingId).then((r) => r.data),
    enabled: Boolean(bookingId),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBookingPayload) => bookingService.create(body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
      const booking = res.data;
      if (booking.bookingId) {
        qc.setQueryData(QUERY_KEYS.bookings.detail(booking.bookingId), undefined);
      }
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      bookingService.cancel(bookingId, reason),
    onSuccess: (_, { bookingId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.detail(bookingId) });
    },
  });
}

export function useEventIdResolver(slug: string) {
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: bookings } = useBookings("all");
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    const fromQuery = searchParams.get("eventId");
    if (fromQuery) {
      registerEventId(slug, fromQuery);
      setResolvedId(fromQuery);
      return;
    }

    const fromRegistry = getRegisteredEventId(slug);
    if (fromRegistry) {
      setResolvedId(fromRegistry);
      return;
    }

    const fromBooking = bookings?.find((b) => b.event.slug === slug)?.event.eventId;
    if (fromBooking) {
      registerEventId(slug, fromBooking);
      setResolvedId(fromBooking);
      return;
    }

    setResolvedId(null);
  }, [slug, searchParams, bookings]);

  return { eventId: resolvedId, isResolving: isAuthenticated && bookings === undefined };
}
