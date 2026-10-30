import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  category: varchar("category", { length: 40 }).notNull(),
  address: text("address").default("").notNull(),
  phone: varchar("phone", { length: 30 }).default("").notNull(),
  whatsapp: varchar("whatsapp", { length: 30 }).default("").notNull(),
  openingHours: varchar("opening_hours", { length: 120 })
    .default("")
    .notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
