import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as profiles from "./schema/profiles";
import * as events from "./schema/events";
import * as registrations from "./schema/registrations";
import * as registrationMembers from "./schema/registration-members";
import * as schedules from "./schema/schedules";
import * as results from "./schema/results";
import * as certificates from "./schema/certificates";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  schema: {
    ...profiles,
    ...events,
    ...registrations,
    ...registrationMembers,
    ...schedules,
    ...results,
    ...certificates,
  },
});
