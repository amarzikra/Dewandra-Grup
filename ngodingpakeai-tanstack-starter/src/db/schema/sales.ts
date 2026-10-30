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
import { paymentMethodEnum, saleStatusEnum } from "./enums";
import { orders } from "./orders";
import { products } from "./products";
import { stores } from "./stores";
import { user } from "./user";

export const sales = pgTable(
  "sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    invoiceNumber: varchar("invoice_number", { length: 60 })
      .notNull()
      .unique(),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    amountPaid: numeric("amount_paid", { precision: 14, scale: 2 }).notNull(),
    changeAmount: numeric("change_amount", {
      precision: 14,
      scale: 2,
    }).notNull(),
    status: saleStatusEnum("status").default("paid").notNull(),
    saleDate: timestamp("sale_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sales_store_date_idx").on(table.storeId, table.saleDate),
    index("sales_status_date_idx").on(table.status, table.saleDate),
    index("sales_order_idx").on(table.orderId),
  ],
);

export const saleItems = pgTable(
  "sale_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    saleId: uuid("sale_id")
      .notNull()
      .references(() => sales.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    qty: integer("qty").notNull(),
    sellPrice: numeric("sell_price", { precision: 14, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
    productName: varchar("product_name", { length: 160 }).notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
    notes: text("notes"),
  },
  (table) => [index("sale_items_sale_idx").on(table.saleId)],
);
