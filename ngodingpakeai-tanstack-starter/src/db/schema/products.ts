import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 60 }).notNull(),
    barcode: varchar("barcode", { length: 80 }),
    name: varchar("name", { length: 160 }).notNull(),
    unit: varchar("unit", { length: 20 }).notNull(),
    sellPrice: numeric("sell_price", { precision: 14, scale: 2 }).notNull(),
    buyPrice: numeric("buy_price", { precision: 14, scale: 2 }).notNull(),
    stockCurrent: integer("stock_current").notNull(),
    stockMin: integer("stock_min").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("products_store_sku_idx").on(table.storeId, table.sku),
    index("products_store_name_idx").on(table.storeId, table.name),
    index("products_barcode_idx").on(table.barcode),
  ],
);
