import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  // Better Auth admin plugin. `role` holds one name, or several separated by
  // commas. Signup cannot set it; see src/lib/permissions.ts for the roles.
  role: text("role"),
  storeId: uuid("store_id").references(() => stores.id, { onDelete: "set null" }),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
