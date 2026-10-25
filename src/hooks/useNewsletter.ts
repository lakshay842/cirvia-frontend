import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

/**
 * Prepared hook for newsletter subscription API (not yet implemented on backend).
 */
export function useNewsletterSubscribe() {
  return useMutation({
    mutationKey: ["newsletter", "subscribe"],
    mutationFn: async (_data: NewsletterFormValues) => {
      void _data;
      throw new Error(
        "Newsletter API is not yet available. Backend CMS module pending.",
      );
    },
  });
}
