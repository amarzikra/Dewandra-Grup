import {
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  fulfillmentMethodEnum,
  orderStatusEnum,
  paymentMethodEnum,
} from "./enums";
import { products } from "./products";
import { stores } from "./stores";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 30 }).notNull(),
    customerPhoneNormalized: varchar("customer_phone_normalized", {
      length: 30,
    }).notNull(),
    customerAddress: text("customer_address"),
    notes: text("notes"),
    fulfillmentMethod: fulfillmentMethodEnum("fulfillment_method").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    paymentProofData: text("payment_proof_data"),
    paymentProofMime: varchar("payment_proof_mime", { length: 80 }),
    paymentProofName: varchar("payment_proof_name", { length: 160 }),
    paymentProofSize: integer("payment_proof_size"),
    paymentProofUploadedAt: timestamp("payment_proof_uploaded_at", {
      withTimezone: true,
    }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    readyAt: timestamp("ready_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("orders_status_created_idx").on(table.status, table.createdAt),
    index("orders_phone_idx").on(table.customerPhoneNormalized),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    productName: varchar("product_name", { length: 160 }).notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
    qty: integer("qty").notNull(),
    unitPrice: numeric("unit_price", { precision: 14, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);
