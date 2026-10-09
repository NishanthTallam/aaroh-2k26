import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { registrations } from "./registrations";

export const registrationMembers = pgTable("registration_members", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  registrationId: text("registration_id")
    .notNull()
    .references(() => registrations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  rollNumber: text("roll_number").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  year: text("year"),
  department: text("department"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RegistrationMember = typeof registrationMembers.$inferSelect;
export type NewRegistrationMember = typeof registrationMembers.$inferInsert;
