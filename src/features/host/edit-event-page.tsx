"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { HostShell } from "@/components/host/host-shell";
import { ErrorState } from "@/components/feedback/error-state";
import { EventGridSkeleton } from "@/components/feedback/loading-skeleton";
import { ROUTES } from "@/constants/routes";
import {
  useArchiveEvent,
  useHostEventDetail,
  useHostEvents,
  usePublishEvent,
  useUnpublishEvent,
  useUpdateEvent,
} from "@/hooks/useEvents";
import { getRegisteredEventId } from "@/lib/event-id-registry";
import { ApiClientError } from "@/types/api.types";

const editSchema = z.object({
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().min(50).max(10000),
  shortDescription: z.string().trim().max(300).optional(),
  capacity: z.number().int().positive().max(10000),
  price: z.number().min(0).max(1000000),
});

type EditFormValues = z.infer<typeof editSchema>;

export function EditEventPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { data: events, isLoading: loadingList } = useHostEvents();

  const listItem = useMemo(
    () => events?.find((e) => getRegisteredEventId(e.slug) === eventId),
    [events, eventId],
  );

  const { data: eventDetail, isLoading: loadingDetail } = useHostEventDetail(eventId);
  const updateEvent = useUpdateEvent(eventId);
  const publishEvent = usePublishEvent();
  const unpublishEvent = useUnpublishEvent();
  const archiveEvent = useArchiveEvent();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (eventDetail) {
      reset({
        title: eventDetail.title,
        description: eventDetail.description,
        shortDescription: eventDetail.shortDescription ?? "",
        capacity: eventDetail.capacity,
        price: eventDetail.price,
      });
    } else if (listItem) {
      reset({
        title: listItem.title,
        description: listItem.title,
        shortDescription: listItem.shortDescription ?? "",
        capacity: 20,
        price: listItem.price,
      });
    }
  }, [eventDetail, listItem, reset]);

  if (loadingList || loadingDetail) {
    return (
      <HostShell title="Edit event">
        <EventGridSkeleton count={1} />
      </HostShell>
    );
  }

  if (!listItem && !eventDetail) {
    return (
      <HostShell title="Edit event">
        <ErrorState
          title="Event not found"
          message="Open this page from My Events after creating the event."
        />
        <Button className="mt-4" variant="outline" onClick={() => router.push(ROUTES.hostEvents)}>
          Back to events
        </Button>
      </HostShell>
    );
  }

  const status = eventDetail?.status ?? listItem?.status ?? "DRAFT";

  return (
    <HostShell title="Edit event">
      {(updateEvent.error as ApiClientError | null) && (
        <p className="mb-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(updateEvent.error as ApiClientError).message}
        </p>
      )}
      {(publishEvent.error as ApiClientError | null) && (
        <p className="mb-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
          {(publishEvent.error as ApiClientError).message}
        </p>
      )}
      {status === "DRAFT" && (
        <p className="mb-4 text-sm text-muted-foreground">
          Draft events are not visible on Discover. Publish when you are ready to go live.
        </p>
      )}

      <form
        className="max-w-2xl space-y-4 rounded-[24px] border border-border bg-surface/50 p-6"
        onSubmit={handleSubmit(async (values) => {
          await updateEvent.mutateAsync({
            title: values.title,
            description: values.description,
            shortDescription: values.shortDescription,
            capacity: values.capacity,
            price: values.price,
          });
          router.push(ROUTES.hostEvents);
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" error={errors.title?.message} {...register("title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Input id="shortDescription" {...register("shortDescription")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" error={errors.description?.message} rows={5} {...register("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" error={errors.capacity?.message} {...register("capacity", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (INR)</Label>
            <Input id="price" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" variant="gradient" loading={updateEvent.isPending}>
            Save changes
          </Button>
          {(status === "DRAFT" || status === "PENDING_REVIEW") && (
            <Button
              type="button"
              variant="secondary"
              loading={publishEvent.isPending}
              onClick={() => publishEvent.mutate(eventId)}
            >
              Publish
            </Button>
          )}
          {(status === "PUBLISHED" || status === "BOOKING_OPEN") && (
            <Button
              type="button"
              variant="outline"
              loading={unpublishEvent.isPending}
              onClick={() => unpublishEvent.mutate(eventId)}
            >
              Unpublish
            </Button>
          )}
          {(status === "COMPLETED" || status === "CANCELLED") && (
            <Button
              type="button"
              variant="outline"
              loading={archiveEvent.isPending}
              onClick={() => archiveEvent.mutate(eventId)}
            >
              Archive
            </Button>
          )}
        </div>
      </form>
    </HostShell>
  );
}
