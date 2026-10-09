"use server";

import { db } from "@/db";
import { certificates, events, profiles, registrations, results } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireManager } from "@/lib/auth/permissions";
import { generateCertificatePdfBuffer } from "@/lib/certificates/generator";
import { uploadCertificatePdf } from "@/lib/storage/certificates";
import { revalidatePath } from "next/cache";

export async function generateParticipantCertificateAction(
  eventId: string,
  participantId?: string
) {
  const user = await requireAuth();
  const targetParticipantId = participantId || user.id;

  // Check if certificate already exists
  const [existing] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.eventId, eventId),
        eq(certificates.participantId, targetParticipantId)
      )
    )
    .limit(1);

  if (existing) {
    return { success: true, certificate: existing };
  }

  // Fetch event and participant
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    return { error: "Event not found." };
  }

  const [participant] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, targetParticipantId))
    .limit(1);

  if (!participant) {
    return { error: "Participant not found." };
  }

  // Verify participant registration
  const [registration] = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.participantId, targetParticipantId)
      )
    )
    .limit(1);

  // Check results for winner status
  const [winnerResult] = await db
    .select()
    .from(results)
    .where(
      and(
        eq(results.eventId, eventId),
        eq(results.participantId, targetParticipantId)
      )
    )
    .limit(1);

  let certificateType: "PARTICIPATION" | "MERIT" | "WINNER" = "PARTICIPATION";
  let positionText = "";

  if (winnerResult) {
    certificateType = "WINNER";
    positionText =
      winnerResult.position === 1
        ? "1st Place (Winner)"
        : winnerResult.position === 2
        ? "2nd Place (Runner-up)"
        : winnerResult.position === 3
        ? "3rd Place (2nd Runner-up)"
        : `Rank ${winnerResult.position}`;
  }

  const certRand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const certificateId = `AAROH26-${event.category.substring(0, 3)}-${certRand}`;

  // Generate PDF Buffer
  const pdfBuffer = await generateCertificatePdfBuffer({
    certificateId,
    certificateType,
    recipientName: participant.name,
    college: participant.college,
    rollNumber: participant.rollNumber,
    eventName: event.name,
    category: event.category,
    eventDate: new Date(event.eventDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    positionText,
  });

  // Upload to Neon Object Storage (aaroh-public)
  const storagePath = await uploadCertificatePdf(certificateId, pdfBuffer);

  // Insert into certificates table
  const [newCert] = await db
    .insert(certificates)
    .values({
      eventId: event.id,
      participantId: participant.id,
      registrationId: registration?.id || null,
      certificateType,
      certificateId,
      storagePath,
    })
    .returning();

  revalidatePath("/dashboard/certificates");
  revalidatePath(`/dashboard/registrations/${registration?.id}`);
  return { success: true, certificate: newCert };
}

export async function generateAllEventCertificatesAction(eventId: string) {
  await requireManager();

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    return { error: "Event not found" };
  }

  // Find all approved registrations
  const approvedRegs = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.status, "APPROVED")
      )
    );

  let generatedCount = 0;
  for (const reg of approvedRegs) {
    try {
      const res = await generateParticipantCertificateAction(
        eventId,
        reg.participantId
      );
      if (res.success) generatedCount++;
    } catch (err) {
      console.error(`Failed to generate cert for ${reg.participantId}`, err);
    }
  }

  revalidatePath("/dashboard/certificates");
  revalidatePath(`/manager/events/${eventId}`);
  revalidatePath(`/admin/events/${eventId}`);
  return { success: true, count: generatedCount };
}
