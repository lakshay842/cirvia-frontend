export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  gateway: string;
  paymentId?: string;
  paymentReference?: string;
}

export interface PaymentSummary {
  id: string;
  paymentReference: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  gateway: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentDetails extends PaymentSummary {
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paymentMethod: string | null;
  failureReason: string | null;
  gatewayTransactionId: string | null;
  bookingReference: string;
  eventTitle: string;
  refund: unknown | null;
  invoice: unknown | null;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResponse {
  payment: PaymentDetails;
  alreadyVerified?: boolean;
}

export interface PaymentsListData {
  payments: PaymentSummary[];
}
