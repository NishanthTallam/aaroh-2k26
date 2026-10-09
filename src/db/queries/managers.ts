import { db } from "../index";
import { profiles, events } from "../schema";
import { eq, desc, or } from "drizzle-orm";

export async function getAllManagers() {
  return await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "EVENT_MANAGER"))
    .orderBy(desc(profiles.createdAt));
}

export async function getAllManagersWithAssignedEvents() {
  const managers = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "EVENT_MANAGER"))
    .orderBy(desc(profiles.createdAt));

  const allEvents = await db.select().from(events);

  return managers.map((mgr) => {
    const assigned = allEvents.filter((e) => e.eventManagerId === mgr.id);
    return {
      ...mgr,
      assignedEvents: assigned,
    };
  });
}

export async function getFestivalCoordinators() {
  const staff = await db
    .select()
    .from(profiles)
    .where(or(eq(profiles.role, "EVENT_MANAGER"), eq(profiles.role, "ADMIN")))
    .orderBy(desc(profiles.role), desc(profiles.createdAt));

  const allEvents = await db.select().from(events);

  return staff.map((mgr) => {
    const assigned = allEvents.filter((e) => e.eventManagerId === mgr.id);
    return {
      ...mgr,
      assignedEvents: assigned,
    };
  });
}
