import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { events } from "./events";
import { profiles } from "./profiles";
import { registrations } from "./registrations";

export const certificates = pgTable("certificates", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  registrationId: text("registration_id").references(() => registrations.id, {
    onDelete: "set null",
  }),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  participantId: text("participant_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  certificateType: text("certificate_type", {
    enum: ["PARTICIPATION", "MERIT", "WINNER"],
  }).notNull(),
  certificateId: text("certificate_id").notNull().unique(),
  storagePath: text("storage_path").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;
