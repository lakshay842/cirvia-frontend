"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { Textarea } from "@/components/core/textarea";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/hooks/useCategories";
import { useCreateEvent } from "@/hooks/useEvents";
import { registerEventId } from "@/lib/event-id-registry";
import {
  createEventSchema,
  toCreateEventPayload,
  type CreateEventFormValues,
} from "@/schemas/host.schema";
import { ApiClientError } from "@/types/api.types";

export function CreateEventPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createEvent = useCreateEvent();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      visibility: "PUBLIC",
      price: 0,
      capacity: 20,
      country: "India",
      startTime: "18:00",
      endTime: "21:00",
    },
  });

  return (
    <div className="pt-24 pb-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Create event</h1>
        <p className="mt-2 text-muted-foreground">Your event will be saved as a draft until published.</p>

        {(createEvent.error as ApiClientError | null) && (
          <p className="mt-4 rounded-[18px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {(createEvent.error as ApiClientError).message}
          </p>
        )}

        <form
          className="mt-8 space-y-4 rounded-[24px] border border-border bg-surface/50 p-6"
          onSubmit={handleSubmit(async (values) => {
            const res = await createEvent.mutateAsync(toCreateEventPayload(values));
            registerEventId(res.data.slug, res.data.eventId);
            router.push(ROUTES.hostEventEdit(res.data.eventId));
          })}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="title">Event title</Label>
            <Input id="title" error={errors.title?.message} {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input id="shortDescription" {...register("shortDescription")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Full description</Label>
            <Textarea id="description" error={errors.description?.message} {...register("description")} rows={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
              {...register("categoryId")}
            >
              <option value="">Select category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" error={errors.capacity?.message} {...register("capacity", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input id="price" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                className="flex h-12 w-full rounded-[18px] border border-border bg-surface/50 px-4 text-sm"
                {...register("visibility")}
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="INVITE_ONLY">Invite only</option>
                <option value="APPROVAL_REQUIRED">Approval required</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event date</Label>
              <Input id="eventDate" type="date" error={errors.eventDate?.message} {...register("eventDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="time" error={errors.startTime?.message} {...register("startTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="time" error={errors.endTime?.message} {...register("endTime")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue name</Label>
            <Input id="venueName" error={errors.venueName?.message} {...register("venueName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" error={errors.addressLine1?.message} {...register("addressLine1")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" error={errors.city?.message} {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" error={errors.state?.message} {...register("state")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" error={errors.country?.message} {...register("country")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" error={errors.postalCode?.message} {...register("postalCode")} />
            </div>
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={createEvent.isPending}>
            Create event
          </Button>
        </form>
      </Container>
    </div>
  );
}
