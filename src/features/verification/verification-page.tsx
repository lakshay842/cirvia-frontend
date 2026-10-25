"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BadgeCheck, Clock, FileSearch, ShieldAlert } from "lucide-react";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { DocumentUploadField } from "@/components/forms/document-upload-field";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/core/skeleton";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import {
  kycFormSchema,
  VERIFICATION_TYPE_LABELS,
  type KycFormValues,
} from "@/schemas/verification.schema";
import {
  canResubmitKyc,
  isKycApproved,
  isKycInReview,
  useResubmitVerification,
  useSubmitVerification,
  useVerificationDetails,
  useVerificationStatus,
} from "@/hooks/useVerification";
import { ApiClientError } from "@/types/api.types";
import type { VerificationStatus } from "@/types/verification.types";

function formatStatus(status: VerificationStatus): string {
  return status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function StatusBanner({ status, remarks }: { status: VerificationStatus; remarks: string | null }) {
  if (status === "APPROVED") {
    return (
      <div className="flex items-start gap-3 rounded-[24px] border border-success/30 bg-success/10 p-5">
        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Identity verified</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your KYC is approved. You can book events and host with full trust on Cirvia.
          </p>
        </div>
      </div>
    );
  }

  if (isKycInReview(status)) {
    return (
      <div className="flex items-start gap-3 rounded-[24px] border border-warning/30 bg-warning/10 p-5">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Under review — {formatStatus(status)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We received your documents. Our team typically reviews submissions within 1–2 business days.
          </p>
        </div>
      </div>
    );
  }

  if (canResubmitKyc(status)) {
    return (
      <div className="flex items-start gap-3 rounded-[24px] border border-danger/30 bg-danger/10 p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Verification {formatStatus(status)}</p>
          {remarks && (
            <p className="mt-1 text-sm text-muted-foreground">Reason: {remarks}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Please upload new documents below to resubmit your verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-border bg-surface/50 p-5">
      <p className="font-semibold text-foreground">Status: {formatStatus(status)}</p>
      {remarks && <p className="mt-1 text-sm text-muted-foreground">{remarks}</p>}
    </div>
  );
}

function KycSubmitForm({ mode }: { mode: "submit" | "resubmit" }) {
  const submit = useSubmitVerification();
  const resubmit = useResubmitVerification();
  const mutation = mode === "submit" ? submit : resubmit;

  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [governmentIdBack, setGovernmentIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: { verificationType: "AADHAAR" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFileError(null);
    setSuccess(false);

    if (!governmentId || !selfie) {
      setFileError("Government ID (front) and selfie are required.");
      return;
    }

    const payload = {
      verificationType: values.verificationType,
      documentNumber: values.documentNumber || undefined,
      expiryDate: values.expiryDate || undefined,
      governmentId,
      governmentIdBack: governmentIdBack ?? undefined,
      selfie,
    };

    await mutation.mutateAsync(payload);
    setSuccess(true);
    setGovernmentId(null);
    setGovernmentIdBack(null);
    setSelfie(null);
  });

  return (
    <form
      className="space-y-5 rounded-[24px] border border-border bg-surface/50 p-6"
      onSubmit={onSubmit}
      noValidate
    >
      <div>
        <h2 className="font-semibold text-foreground">
          {mode === "submit" ? "Submit identity verification" : "Resubmit documents"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a government-issued ID and a clear selfie. Images must be JPG, PNG, or WebP (max 10 MB).
        </p>
      </div>

      {(mutation.error as ApiClientError | null) && (
        <p className="rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(mutation.error as ApiClientError).message}
        </p>
      )}
      {fileError && (
        <p className="rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {fileError}
        </p>
      )}
      {success && (
        <p className="rounded-[18px] border border-success/30 bg-success/10 p-3 text-sm text-success" role="status">
          Documents submitted successfully. We&apos;ll notify you when review is complete.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="verificationType">ID document type *</Label>
        <select
          id="verificationType"
          className="flex h-11 w-full rounded-[18px] border border-input bg-background/50 px-4 text-sm"
          {...register("verificationType")}
        >
          {Object.entries(VERIFICATION_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.verificationType && (
          <p className="text-xs text-danger">{errors.verificationType.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Document number (optional)</Label>
          <Input id="documentNumber" error={errors.documentNumber?.message} {...register("documentNumber")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry date (optional)</Label>
          <Input id="expiryDate" type="date" error={errors.expiryDate?.message} {...register("expiryDate")} />
        </div>
      </div>

      <DocumentUploadField
        id="governmentId"
        label="Government ID — front"
        hint="Photo of the front of your ID."
        required
        value={governmentId}
        onChange={setGovernmentId}
      />
      <DocumentUploadField
        id="governmentIdBack"
        label="Government ID — back"
        hint="Optional for passports; required for two-sided IDs like Aadhaar."
        value={governmentIdBack}
        onChange={setGovernmentIdBack}
      />
      <DocumentUploadField
        id="selfie"
        label="Selfie"
        hint="Hold your ID next to your face in good lighting."
        required
        value={selfie}
        onChange={setSelfie}
      />

      <Button type="submit" variant="gradient" className="w-full" loading={mutation.isPending}>
        {mode === "submit" ? "Submit for verification" : "Resubmit for verification"}
      </Button>
    </form>
  );
}

export function VerificationPage() {
  const { data: status, isLoading, isError, refetch } = useVerificationStatus();
  const hasVerification = Boolean(status);
  const { data: details } = useVerificationDetails(hasVerification);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <Container className="max-w-3xl space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-40 w-full rounded-[24px]" />
          <Skeleton className="h-96 w-full rounded-[24px]" />
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-24 pb-16">
        <Container className="max-w-3xl">
          <ErrorState onRetry={() => refetch()} />
        </Container>
      </div>
    );
  }

  const showSubmitForm = !status;
  const showResubmitForm = status && canResubmitKyc(status.status);

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-3xl">
        <div className="mb-6">
          <Link href={ROUTES.profile} className="text-sm text-primary hover:underline">
            ← Back to profile
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Identity verification (KYC)</h1>
          <p className="mt-2 text-muted-foreground">
            Verify your identity to book events, build trust, and unlock hosting on Cirvia.
          </p>
        </div>

        {status && <StatusBanner status={status.status} remarks={status.remarks} />}

        {status && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-border bg-surface/50 p-4">
              <p className="text-xs text-muted-foreground">Document type</p>
              <p className="mt-1 font-medium text-foreground">
                {VERIFICATION_TYPE_LABELS[status.verificationType]}
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-surface/50 p-4">
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="mt-1 font-medium text-foreground">{formatDate(status.submittedAt)}</p>
            </div>
          </div>
        )}

        {details && details.timeline.length > 0 && (
          <div className="mt-6 rounded-[24px] border border-border bg-surface/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="font-semibold text-foreground">Verification timeline</h2>
            </div>
            <ol className="space-y-3">
              {details.timeline.map((item) => (
                <li key={item.id} className="rounded-xl border border-border/60 px-4 py-3 text-sm">
                  <p className="font-medium text-foreground">
                    {formatStatus(item.oldStatus)} → {formatStatus(item.newStatus)}
                  </p>
                  {item.reason && (
                    <p className="mt-1 text-muted-foreground">{item.reason}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {showSubmitForm && (
          <div className="mt-6">
            <KycSubmitForm mode="submit" />
          </div>
        )}

        {showResubmitForm && (
          <div className="mt-6">
            <KycSubmitForm mode="resubmit" />
          </div>
        )}

        {status && isKycApproved(status.status) && (
          <p className="mt-6 text-sm text-muted-foreground">
            No further action is needed. You can update your profile anytime from{" "}
            <Link href={ROUTES.profile} className="text-primary hover:underline">
              your profile page
            </Link>
            .
          </p>
        )}

        {status && isKycInReview(status.status) && (
          <p className="mt-6 text-sm text-muted-foreground">
            You&apos;ll receive a notification when your verification is reviewed. Check{" "}
            <Link href={ROUTES.notifications} className="text-primary hover:underline">
              notifications
            </Link>{" "}
            for updates.
          </p>
        )}
      </Container>
    </div>
  );
}
