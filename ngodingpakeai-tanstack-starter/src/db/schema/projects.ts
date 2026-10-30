import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").references(() => stores.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").default("").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("projects_created_idx").on(table.createdAt)],
);
