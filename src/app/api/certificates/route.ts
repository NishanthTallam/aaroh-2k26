import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { certificates, events, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFileViewUrl } from "@/lib/storage/certificates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const certId = searchParams.get("id");
  const registrationId = searchParams.get("registrationId");

  if (!certId && !registrationId) {
    return NextResponse.json(
      { error: "Please provide a certificate ID or registration ID." },
      { status: 400 }
    );
  }

  let certRow;
  if (certId) {
    [certRow] = await db
      .select({
        cert: certificates,
        event: events,
        participant: profiles,
      })
      .from(certificates)
      .innerJoin(events, eq(certificates.eventId, events.id))
      .innerJoin(profiles, eq(certificates.participantId, profiles.id))
      .where(eq(certificates.certificateId, certId))
      .limit(1);
  } else if (registrationId) {
    [certRow] = await db
      .select({
        cert: certificates,
        event: events,
        participant: profiles,
      })
      .from(certificates)
      .innerJoin(events, eq(certificates.eventId, events.id))
      .innerJoin(profiles, eq(certificates.participantId, profiles.id))
      .where(eq(certificates.registrationId, registrationId))
      .limit(1);
  }

  if (!certRow) {
    return NextResponse.json(
      { error: "Certificate not found." },
      { status: 404 }
    );
  }

  const downloadUrl = await getFileViewUrl(certRow.cert.storagePath);

  return NextResponse.json({
    valid: true,
    certificateId: certRow.cert.certificateId,
    certificateType: certRow.cert.certificateType,
    generatedAt: certRow.cert.generatedAt,
    recipient: {
      name: certRow.participant.name,
      college: certRow.participant.college,
      rollNumber: certRow.participant.rollNumber,
    },
    event: {
      name: certRow.event.name,
      category: certRow.event.category,
      eventDate: certRow.event.eventDate,
    },
    downloadUrl,
  });
}
