import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { events } from "./events";
import { profiles } from "./profiles";
import { registrations } from "./registrations";

export const results = pgTable("results", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  participantId: text("participant_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  registrationId: text("registration_id").references(() => registrations.id, {
    onDelete: "set null",
  }),
  position: integer("position").notNull(),
  score: text("score"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Result = typeof results.$inferSelect;
export type NewResult = typeof results.$inferInsert;
