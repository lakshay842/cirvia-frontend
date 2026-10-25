export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "BLOCKED"
  | "EXPIRED"
  | "RESUBMITTED"
  | "CANCELLED";

export type VerificationType =
  | "AADHAAR"
  | "PASSPORT"
  | "DRIVING_LICENSE"
  | "VOTER_ID"
  | "PAN_CARD"
  | "INTERNATIONAL_ID";

export interface VerificationStatusView {
  id: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDocumentView {
  id: string;
  documentType: string;
  hasFrontImage: boolean;
  hasBackImage: boolean;
  hasSelfieImage: boolean;
  frontImageUrl?: string;
  backImageUrl?: string;
  selfieImageUrl?: string;
  expiryDate: string | null;
  createdAt: string;
}

export interface VerificationTimelineItem {
  id: string;
  oldStatus: VerificationStatus;
  newStatus: VerificationStatus;
  reason: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface VerificationDetailsView extends VerificationStatusView {
  documents: VerificationDocumentView[];
  timeline: VerificationTimelineItem[];
}

export interface SubmitVerificationPayload {
  verificationType: VerificationType;
  documentNumber?: string;
  expiryDate?: string;
  governmentId: File;
  governmentIdBack?: File;
  selfie: File;
}
