import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const companyProfile = pgTable("company_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  about: text("about").default("").notNull(),
  experience: text("experience").default("").notNull(),
  legalInfo: text("legal_info").default("").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
