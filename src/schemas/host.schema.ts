import { z } from "zod";

const addressSchema = z.object({
  addressLine1: z.string().trim().min(1, "Address is required").max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  country: z.string().trim().min(1, "Country is required").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
});

export const becomeHostSchema = z.object({
  bio: z.string().trim().min(10, "Bio must be at least 10 characters").max(1000),
  experience: z.string().trim().min(1, "Experience is required").max(500),
  languages: z.string().trim().min(1, "At least one language required"),
  displayName: z.string().trim().min(2).max(100).optional(),
  addressLine1: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  emergencyName: z.string().trim().min(1, "Emergency contact name required"),
  emergencyPhone: z.string().trim().min(8, "Valid phone required").max(20),
});

export type BecomeHostFormValues = z.infer<typeof becomeHostSchema>;

export const createEventSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().trim().min(50, "Description must be at least 50 characters").max(10000),
  shortDescription: z.string().trim().max(300).optional(),
  categoryId: z.string().uuid("Select a category"),
  capacity: z.number().int().positive("Capacity must be positive").max(10000),
  price: z.number().min(0).max(1000000),
  visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "APPROVAL_REQUIRED"]),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  venueName: z.string().trim().min(1, "Venue name is required"),
  addressLine1: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

export function toBecomeHostPayload(values: BecomeHostFormValues) {
  return {
    bio: values.bio,
    experience: values.experience,
    languages: values.languages.split(",").map((l) => l.trim()).filter(Boolean),
    displayName: values.displayName,
    address: addressSchema.parse({
      addressLine1: values.addressLine1,
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.postalCode,
    }),
    emergencyContact: {
      name: values.emergencyName,
      phone: values.emergencyPhone,
    },
  };
}

export function toCreateEventPayload(values: CreateEventFormValues) {
  return {
    title: values.title,
    description: values.description,
    shortDescription: values.shortDescription,
    categoryId: values.categoryId,
    capacity: values.capacity,
    price: values.price,
    currency: "INR",
    visibility: values.visibility,
    eventDate: values.eventDate,
    startTime: values.startTime,
    endTime: values.endTime,
    location: {
      venueName: values.venueName,
      addressLine1: values.addressLine1,
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.postalCode,
    },
  };
}
