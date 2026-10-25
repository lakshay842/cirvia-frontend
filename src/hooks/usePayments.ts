import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { paymentService } from "@/services/payment.service";
import type { VerifyPaymentPayload } from "@/types/payment.types";

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (bookingId: string) => paymentService.createOrder(bookingId),
  });
}

export function useVerifyPayment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: VerifyPaymentPayload) => paymentService.verify(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.payments.list() });
    },
  });
}

export function usePaymentDetails(paymentId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.detail(paymentId),
    queryFn: async () => {
      const res = await paymentService.getDetails(paymentId);
      return res.data.payment;
    },
    enabled: Boolean(paymentId),
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.payments.list(),
    queryFn: async () => {
      const res = await paymentService.list({ limit: 20 });
      return res.data.payments;
    },
  });
}
