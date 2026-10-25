import { z } from "zod";

const verificationTypeSchema = z.enum([
  "AADHAAR",
  "PASSPORT",
  "DRIVING_LICENSE",
  "VOTER_ID",
  "PAN_CARD",
  "INTERNATIONAL_ID",
]);

export const VERIFICATION_TYPE_LABELS: Record<z.infer<typeof verificationTypeSchema>, string> = {
  AADHAAR: "Aadhaar card",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving license",
  VOTER_ID: "Voter ID",
  PAN_CARD: "PAN card",
  INTERNATIONAL_ID: "International ID",
};

export const kycFormSchema = z.object({
  verificationType: verificationTypeSchema,
  documentNumber: z.string().trim().min(4, "Document number must be at least 4 characters").max(50).optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
});

export type KycFormValues = z.infer<typeof kycFormSchema>;
