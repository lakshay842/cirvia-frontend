import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { hostBookingService } from "@/services/booking.service";
import { useAuthStore } from "@/stores/auth-store";
import type { HostBookingSummary } from "@/types/booking.types";

export function useHostBookings(status?: string) {
  const isHost = useAuthStore((s) => s.hasRole("HOST"));

  return useQuery({
    queryKey: QUERY_KEYS.bookings.hostList({ status }),
    queryFn: async () => {
      const res = await hostBookingService.list({ status, limit: 50 });
      return res.data.bookings as HostBookingSummary[];
    },
    enabled: isHost,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useApproveHostBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => hostBookingService.approve(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.hostList() });
    },
  });
}

export function useRejectHostBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      hostBookingService.reject(bookingId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.hostList() });
    },
  });
}
