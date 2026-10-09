import { db } from "../index";
import { profiles, registrations, events, certificates } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function getAdminDashboardStats() {
  const [totalParticipants] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(profiles)
    .where(eq(profiles.role, "PARTICIPANT"));

  const [totalRegistrations] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations);

  const [approvedRegistrations] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(eq(registrations.status, "APPROVED"));

  const [pendingRegistrations] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(eq(registrations.status, "PENDING"));

  const [totalRevenue] = await db
    .select({ sum: sql<number>`coalesce(sum(fee), 0)::int` })
    .from(registrations)
    .where(eq(registrations.status, "APPROVED"));

  const [totalEvents] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events);

  return {
    totalParticipants: totalParticipants?.count || 0,
    totalRegistrations: totalRegistrations?.count || 0,
    approvedRegistrations: approvedRegistrations?.count || 0,
    pendingRegistrations: pendingRegistrations?.count || 0,
    totalRevenue: totalRevenue?.sum || 0,
    totalEvents: totalEvents?.count || 0,
  };
}

export async function getManagerDashboardStats(managerId: string) {
  const managerEvents = await db
    .select()
    .from(events)
    .where(eq(events.eventManagerId, managerId));

  const eventIds = managerEvents.map((e) => e.id);

  if (eventIds.length === 0) {
    return {
      eventsCount: 0,
      registrationsCount: 0,
      approvedCount: 0,
      pendingCount: 0,
    };
  }

  const [totalRegs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(sql`${registrations.eventId} IN ${eventIds}`);

  const [approvedRegs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(
      sql`${registrations.eventId} IN ${eventIds} AND ${registrations.status} = 'APPROVED'`
    );

  const [pendingRegs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(
      sql`${registrations.eventId} IN ${eventIds} AND ${registrations.status} = 'PENDING'`
    );

  return {
    eventsCount: managerEvents.length,
    registrationsCount: totalRegs?.count || 0,
    approvedCount: approvedRegs?.count || 0,
    pendingCount: pendingRegs?.count || 0,
  };
}

export async function getParticipantDashboardStats(participantId: string) {
  const [totalRegs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(eq(registrations.participantId, participantId));

  const [approvedRegs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(
      sql`${registrations.participantId} = ${participantId} AND ${registrations.status} = 'APPROVED'`
    );

  const [totalCerts] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(certificates)
    .where(eq(certificates.participantId, participantId));

  return {
    registeredCount: totalRegs?.count || 0,
    approvedCount: approvedRegs?.count || 0,
    certificatesCount: totalCerts?.count || 0,
  };
}
