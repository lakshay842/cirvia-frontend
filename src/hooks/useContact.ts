import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Prepared hook for POST /api/v1/support/tickets (not yet implemented on backend).
 * UI validates locally; mutation is disabled until the API ships.
 */
export function useContactSubmit() {
  return useMutation({
    mutationKey: ["contact", "submit"],
    mutationFn: async (_data: ContactFormValues) => {
      void _data;
      throw new Error(
        "Contact API is not yet available. Backend support module pending.",
      );
    },
  });
}
