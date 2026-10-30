import { z } from "zod";

export const createContactSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.email().max(160),
    phone: z.string().trim().max(30).optional().default(""),
    message: z.string().trim().min(1).max(5_000),
  })
  .strict();

export type CreateContactInput = z.infer<typeof createContactSchema>;
