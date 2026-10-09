import { db } from "../index";
import {
  registrations,
  events,
  profiles,
  registrationMembers,
} from "../schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getRegistrationById(id: string) {
  const [registration] = await db
    .select({
      registration: registrations,
      event: events,
      participant: profiles,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .innerJoin(profiles, eq(registrations.participantId, profiles.id))
    .where(eq(registrations.id, id))
    .limit(1);

  if (!registration) return null;

  const members = await db
    .select()
    .from(registrationMembers)
    .where(eq(registrationMembers.registrationId, id));

  return {
    ...registration.registration,
    event: registration.event,
    participant: registration.participant,
    members,
  };
}

export async function getRegistrationsByParticipant(participantId: string) {
  const rows = await db
    .select({
      registration: registrations,
      event: events,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.participantId, participantId))
    .orderBy(desc(registrations.createdAt));

  return rows.map((r) => ({
    ...r.registration,
    event: r.event,
  }));
}

export async function getRegistrationsByEvent(eventId: string) {
  const rows = await db
    .select({
      registration: registrations,
      participant: profiles,
    })
    .from(registrations)
    .innerJoin(profiles, eq(registrations.participantId, profiles.id))
    .where(eq(registrations.eventId, eventId))
    .orderBy(desc(registrations.createdAt));

  return rows.map((r) => ({
    ...r.registration,
    participant: r.participant,
  }));
}

export async function getEventRegistrationsDetailed(eventId: string) {
  const rows = await getRegistrationsByEvent(eventId);
  const regIds = rows.map((r) => r.id);

  let membersList: (typeof registrationMembers.$inferSelect)[] = [];
  if (regIds.length > 0) {
    membersList = await db
      .select()
      .from(registrationMembers)
      .where(sql`${registrationMembers.registrationId} IN ${regIds}`);
  }

  const memberMap = new Map<string, (typeof registrationMembers.$inferSelect)[]>();
  for (const m of membersList) {
    const list = memberMap.get(m.registrationId) || [];
    list.push(m);
    memberMap.set(m.registrationId, list);
  }

  return rows.map((r) => ({
    ...r,
    members: memberMap.get(r.id) || [],
  }));
}

export async function getAllRegistrations() {
  const rows = await db
    .select({
      registration: registrations,
      event: events,
      participant: profiles,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .innerJoin(profiles, eq(registrations.participantId, profiles.id))
    .orderBy(desc(registrations.createdAt));

  return rows.map((r) => ({
    ...r.registration,
    event: r.event,
    participant: r.participant,
  }));
}

export async function getRegistrationForVerification(id: string) {
  const [row] = await db
    .select({
      id: registrations.id,
      registrationType: registrations.registrationType,
      teamName: registrations.teamName,
      status: registrations.status,
      attended: registrations.attended,
      eventName: events.name,
      eventCategory: events.category,
      eventDate: events.eventDate,
      venue: events.venue,
      participantName: profiles.name,
      college: profiles.college,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .innerJoin(profiles, eq(registrations.participantId, profiles.id))
    .where(eq(registrations.id, id))
    .limit(1);

  return row || null;
}
