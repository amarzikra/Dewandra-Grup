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
import { paymentMethodEnum } from "./enums";
import { products } from "./products";
import { stores } from "./stores";
import { suppliers } from "./suppliers";
import { user } from "./user";

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "restrict" }),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    invoiceNumber: varchar("invoice_number", { length: 60 })
      .notNull()
      .unique(),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    purchaseDate: timestamp("purchase_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("purchases_store_date_idx").on(table.storeId, table.purchaseDate),
  ],
);

export const purchaseItems = pgTable(
  "purchase_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => purchases.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    qty: integer("qty").notNull(),
    buyPrice: numeric("buy_price", { precision: 14, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
    productName: varchar("product_name", { length: 160 }).notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
  },
  (table) => [index("purchase_items_purchase_idx").on(table.purchaseId)],
);
