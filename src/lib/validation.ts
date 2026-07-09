import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),

  email: z.string().trim().toLowerCase().email("Invalid email address").max(120),

  subject: z.string().trim().max(150).optional(),

  message: z.string().trim().min(10, "Message is too short").max(3000, "Message is too long"),

  // hidden field against bots

  honeypot: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function validateContactInput(data: unknown) {
  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,

      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,

    data: result.data,
  };
}
