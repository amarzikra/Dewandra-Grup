import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { stockMovementTypeEnum } from "./enums";
import { products } from "./products";
import { stores } from "./stores";
import { user } from "./user";

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    type: stockMovementTypeEnum("type").notNull(),
    referenceId: uuid("reference_id"),
    qtyChange: integer("qty_change").notNull(),
    stockAfter: integer("stock_after").notNull(),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("stock_movements_store_product_idx").on(
      table.storeId,
      table.productId,
      table.createdAt,
    ),
    index("stock_movements_reference_idx").on(table.referenceId),
  ],
);
