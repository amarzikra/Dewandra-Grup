import { pgEnum } from "drizzle-orm/pg-core";

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "transfer",
  "qris",
]);

export const saleStatusEnum = pgEnum("sale_status", ["paid", "cancelled"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "awaiting_confirmation",
  "processing",
  "ready",
  "completed",
  "cancelled",
]);

export const fulfillmentMethodEnum = pgEnum("fulfillment_method", [
  "pickup",
  "delivery",
]);

export const stockMovementTypeEnum = pgEnum("stock_movement_type", [
  "sale",
  "purchase",
  "adjustment",
]);

export const contactStatusEnum = pgEnum("contact_status", [
  "new",
  "read",
  "replied",
]);
