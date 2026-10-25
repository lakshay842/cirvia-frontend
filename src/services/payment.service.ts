import { get, post } from "@/lib/api";
import type {
  PaymentDetails,
  PaymentOrder,
  PaymentsListData,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types/payment.types";

export const paymentService = {
  createOrder: (bookingId: string) =>
    post<PaymentOrder>("/payments/order", { bookingId }),

  verify: (body: VerifyPaymentPayload) =>
    post<VerifyPaymentResponse>("/payments/verify", body),

  list: (params?: { page?: number; limit?: number; status?: string }) =>
    get<PaymentsListData>("/payments", params as Record<string, unknown>),

  getDetails: (paymentId: string) =>
    get<{ payment: PaymentDetails }>(`/payments/${paymentId}`),

  getStatus: (paymentId: string) =>
    get<{ paymentId: string; paymentStatus: string; bookingId: string }>(`/payments/${paymentId}/status`),
};
