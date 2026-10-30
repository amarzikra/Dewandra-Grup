import { z } from "zod";
import { isValidPhone } from "@/lib/phone";

const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(30)
  .refine(isValidPhone, "Nomor WhatsApp tidak valid.");

const orderNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^DG-\d{8}-[A-Z0-9]{8}$/, "Kode pesanan tidak valid.");

export const orderProofSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    type: z.enum([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]),
    dataBase64: z.string().min(1).max(4_000_000),
  })
  .strict();

const orderItemSchema = z
  .object({
    productId: z.uuid(),
    qty: z.number().int().min(1).max(999),
  })
  .strict();

export const createOrderSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    customerPhone: phoneSchema,
    customerAddress: z.string().trim().max(500).optional().default(""),
    notes: z.string().trim().max(1_000).optional().default(""),
    fulfillmentMethod: z.enum(["pickup", "delivery"]),
    paymentMethod: z.enum(["transfer", "cash"]),
    items: z.array(orderItemSchema).min(1).max(50),
    proof: orderProofSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      value.fulfillmentMethod === "delivery" &&
      value.customerAddress.length < 5
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["customerAddress"],
        message: "Alamat pengiriman wajib diisi.",
      });
    }
  });

export const lookupOrderSchema = z
  .object({
    orderNumber: orderNumberSchema,
    phone: phoneSchema,
  })
  .strict();

export const attachOrderProofSchema = z
  .object({
    orderNumber: orderNumberSchema,
    phone: phoneSchema,
    proof: orderProofSchema,
  })
  .strict();

export const updateOrderSchema = z
  .object({
    action: z.enum([
      "confirm-payment",
      "mark-ready",
      "mark-completed",
      "cancel",
    ]),
    reason: z.string().trim().max(500).optional().default(""),
  })
  .strict();

export const orderIdSchema = z.uuid();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type LookupOrderInput = z.infer<typeof lookupOrderSchema>;
export type AttachOrderProofInput = z.infer<typeof attachOrderProofSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderProofInput = z.infer<typeof orderProofSchema>;
