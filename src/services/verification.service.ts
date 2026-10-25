import { get, postForm } from "@/lib/api";
import type {
  SubmitVerificationPayload,
  VerificationDetailsView,
  VerificationStatusView,
  VerificationType,
} from "@/types/verification.types";

function buildSubmitFormData(
  payload: SubmitVerificationPayload,
): FormData {
  const form = new FormData();
  form.append("verificationType", payload.verificationType);
  if (payload.documentNumber?.trim()) {
    form.append("documentNumber", payload.documentNumber.trim());
  }
  if (payload.expiryDate?.trim()) {
    form.append("expiryDate", payload.expiryDate.trim());
  }
  form.append("governmentId", payload.governmentId);
  if (payload.governmentIdBack) {
    form.append("governmentIdBack", payload.governmentIdBack);
  }
  form.append("selfie", payload.selfie);
  return form;
}

export const verificationService = {
  getStatus: () =>
    get<{ verification?: VerificationStatusView; status?: null; message?: string }>(
      "/verification/status",
    ),

  getCurrentDetails: () =>
    get<{ verification: VerificationDetailsView }>("/verification/details"),

  submit: (payload: SubmitVerificationPayload) =>
    postForm<{ verification: VerificationStatusView }>(
      "/verification",
      buildSubmitFormData(payload),
    ),

  resubmit: (payload: Partial<SubmitVerificationPayload> & { verificationType?: VerificationType }) => {
    const form = new FormData();
    if (payload.verificationType) {
      form.append("verificationType", payload.verificationType);
    }
    if (payload.documentNumber?.trim()) {
      form.append("documentNumber", payload.documentNumber.trim());
    }
    if (payload.expiryDate?.trim()) {
      form.append("expiryDate", payload.expiryDate.trim());
    }
    if (payload.governmentId) form.append("governmentId", payload.governmentId);
    if (payload.governmentIdBack) form.append("governmentIdBack", payload.governmentIdBack);
    if (payload.selfie) form.append("selfie", payload.selfie);
    return postForm<{ verification: VerificationStatusView }>("/verification/resubmit", form);
  },
};
