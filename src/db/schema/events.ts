import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./profiles";

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category", {
    enum: ["CULTURAL", "SPORTS", "CREATIVE_MEDIA", "FOOD_FEST"],
  }).notNull(),
  description: text("description").notNull(),
  rules: text("rules"),
  venue: text("venue").notNull(),
  registrationType: text("registration_type", {
    enum: ["SOLO", "TEAM", "BOTH"],
  }).notNull(),
  soloFee: integer("solo_fee").default(0).notNull(),
  teamFee: integer("team_fee").default(0).notNull(),
  minTeamSize: integer("min_team_size").default(1).notNull(),
  maxTeamSize: integer("max_team_size").default(1).notNull(),
  registrationOpen: timestamp("registration_open", { withTimezone: true }).notNull(),
  registrationClose: timestamp("registration_close", { withTimezone: true }).notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  status: text("status", {
    enum: ["DRAFT", "PUBLISHED", "COMPLETED"],
  })
    .default("DRAFT")
    .notNull(),
  imageUrl: text("image_url"),
  eventManagerId: text("event_manager_id").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
