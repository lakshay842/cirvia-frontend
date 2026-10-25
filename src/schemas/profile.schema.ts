import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
    bio: z.string().trim().max(500).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dob: z.string().optional(),
    occupation: z.string().trim().max(100).optional(),
    company: z.string().trim().max(100).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    country: z.string().trim().max(100).optional(),
    instagram: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  })
  .refine((d) => Object.keys(d).some((k) => d[k as keyof typeof d] !== undefined && d[k as keyof typeof d] !== ""), {
    message: "At least one field is required",
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
