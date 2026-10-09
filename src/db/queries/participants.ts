import { db } from "../index";
import { profiles, certificates, events, registrations } from "../schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getProfileByUserId(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return profile || null;
}

export async function getProfileById(id: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  return profile || null;
}

export async function getProfileByEmail(email: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);

  return profile || null;
}

export async function getAllParticipants() {
  return await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "PARTICIPANT"))
    .orderBy(desc(profiles.createdAt));
}

export async function getAllParticipantsWithStats() {
  const allProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "PARTICIPANT"))
    .orderBy(desc(profiles.createdAt));

  const regCounts = await db
    .select({
      participantId: registrations.participantId,
      count: sql<number>`count(*)::int`,
    })
    .from(registrations)
    .groupBy(registrations.participantId);

  const regMap = new Map<string, number>();
  for (const rc of regCounts) {
    regMap.set(rc.participantId, rc.count);
  }

  return allProfiles.map((p) => ({
    ...p,
    registrationsCount: regMap.get(p.id) || 0,
  }));
}

export async function getCertificatesByParticipant(participantId: string) {
  const rows = await db
    .select({
      certificate: certificates,
      event: events,
    })
    .from(certificates)
    .innerJoin(events, eq(certificates.eventId, events.id))
    .where(eq(certificates.participantId, participantId))
    .orderBy(desc(certificates.generatedAt));

  return rows.map((r) => ({
    ...r.certificate,
    event: r.event,
  }));
}
