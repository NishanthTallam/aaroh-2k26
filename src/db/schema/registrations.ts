import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { events } from "./events";
import { profiles } from "./profiles";

export const registrations = pgTable("registrations", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  participantId: text("participant_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  registrationType: text("registration_type", {
    enum: ["SOLO", "TEAM"],
  }).notNull(),
  teamName: text("team_name"),
  fee: integer("fee").notNull(),
  utrNumber: text("utr_number").notNull(),
  paymentScreenshotPath: text("payment_screenshot_path").notNull(),
  status: text("status", {
    enum: ["PENDING", "APPROVED", "REJECTED"],
  })
    .default("PENDING")
    .notNull(),
  rejectionReason: text("rejection_reason"),
  registrationQrData: text("registration_qr_data"),
  registrationQrStoragePath: text("registration_qr_storage_path"),
  attended: boolean("attended").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
