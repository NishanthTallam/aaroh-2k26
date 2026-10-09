import { db } from "../index";
import { events, schedules, results, profiles } from "../schema";
import { eq, desc, asc, and } from "drizzle-orm";

export async function getAllEvents() {
  return await db.select().from(events).orderBy(desc(events.createdAt));
}

export async function getPublishedEvents() {
  return await db
    .select()
    .from(events)
    .where(eq(events.status, "PUBLISHED"))
    .orderBy(asc(events.eventDate));
}

export async function getEventsByCategory(
  category: "CULTURAL" | "SPORTS" | "CREATIVE_MEDIA" | "FOOD_FEST"
) {
  return await db
    .select()
    .from(events)
    .where(and(eq(events.status, "PUBLISHED"), eq(events.category, category)))
    .orderBy(asc(events.eventDate));
}

export async function getEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!event) return null;

  const eventSchedules = await db
    .select()
    .from(schedules)
    .where(eq(schedules.eventId, event.id))
    .orderBy(asc(schedules.startTime));

  return {
    ...event,
    schedules: eventSchedules,
  };
}

export async function getEventById(id: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  return event || null;
}

export async function getEventsByManager(managerId: string) {
  return await db
    .select()
    .from(events)
    .where(eq(events.eventManagerId, managerId))
    .orderBy(desc(events.createdAt));
}

export async function getCompletedEventsWithResults() {
  const completedEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, "COMPLETED"))
    .orderBy(desc(events.eventDate));

  const eventsWithResults = await Promise.all(
    completedEvents.map(async (event) => {
      const eventResults = await db
        .select({
          id: results.id,
          position: results.position,
          score: results.score,
          remarks: results.remarks,
          participantName: profiles.name,
          college: profiles.college,
        })
        .from(results)
        .leftJoin(profiles, eq(results.participantId, profiles.id))
        .where(eq(results.eventId, event.id))
        .orderBy(asc(results.position));

      return {
        ...event,
        results: eventResults,
      };
    })
  );

  return eventsWithResults;
}
