import { db } from "../index";
import { results, events, profiles, registrations } from "../schema";
import { eq, asc, desc } from "drizzle-orm";

export async function getAllResultsWithDetails() {
  const rows = await db
    .select({
      result: results,
      event: events,
      participant: profiles,
      registration: registrations,
    })
    .from(results)
    .innerJoin(events, eq(results.eventId, events.id))
    .leftJoin(profiles, eq(results.participantId, profiles.id))
    .leftJoin(registrations, eq(results.registrationId, registrations.id))
    .orderBy(desc(events.eventDate), asc(results.position));

  return rows.map((r) => ({
    ...r.result,
    event: r.event,
    participant: r.participant,
    registration: r.registration,
  }));
}

export async function getResultsByEvent(eventId: string) {
  const rows = await db
    .select({
      result: results,
      participant: profiles,
      registration: registrations,
    })
    .from(results)
    .leftJoin(profiles, eq(results.participantId, profiles.id))
    .leftJoin(registrations, eq(results.registrationId, registrations.id))
    .where(eq(results.eventId, eventId))
    .orderBy(asc(results.position));

  return rows.map((r) => ({
    ...r.result,
    participant: r.participant,
    registration: r.registration,
  }));
}
