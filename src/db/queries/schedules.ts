import { db } from "../index";
import { schedules, events } from "../schema";
import { eq, asc, desc } from "drizzle-orm";

export async function getAllSchedulesWithEvent() {
  const rows = await db
    .select({
      schedule: schedules,
      event: events,
    })
    .from(schedules)
    .innerJoin(events, eq(schedules.eventId, events.id))
    .orderBy(asc(schedules.startTime));

  return rows.map((r) => ({
    ...r.schedule,
    event: r.event,
  }));
}

export async function getSchedulesByManagerWithEvent(managerId: string) {
  const rows = await db
    .select({
      schedule: schedules,
      event: events,
    })
    .from(schedules)
    .innerJoin(events, eq(schedules.eventId, events.id))
    .where(eq(events.eventManagerId, managerId))
    .orderBy(asc(schedules.startTime));

  return rows.map((r) => ({
    ...r.schedule,
    event: r.event,
  }));
}
