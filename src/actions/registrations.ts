"use server";

import { db } from "@/db";
import { registrations, registrationMembers, events, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { uploadPaymentScreenshot, uploadRegistrationQr } from "@/lib/storage/certificates";
import QRCode from "qrcode";
import { redirect } from "next/navigation";

export type RegistrationActionResult = {
  success?: boolean;
  error?: string;
  registrationId?: string;
};

export async function createRegistrationAction(
  prevState: RegistrationActionResult | null,
  formData: FormData
): Promise<RegistrationActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to register for events." };
  }

  const eventId = formData.get("eventId") as string;
  const registrationType = formData.get("registrationType") as "SOLO" | "TEAM";
  const teamName = (formData.get("teamName") as string) || null;
  const utrNumber = (formData.get("utrNumber") as string)?.trim();
  const paymentScreenshot = formData.get("paymentScreenshot") as File | null;

  if (!eventId || !registrationType || !utrNumber) {
    return { error: "Please fill in all required registration fields." };
  }

  if (utrNumber.length < 8) {
    return { error: "Please enter a valid Bank UTR / Transaction Reference Number." };
  }

  // Payment screenshot validation
  if (!paymentScreenshot || paymentScreenshot.size === 0) {
    return { error: "Payment screenshot is required." };
  }

  if (paymentScreenshot.size > 5 * 1024 * 1024) {
    return { error: "Payment screenshot must be smaller than 5 MB." };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(paymentScreenshot.type)) {
    return { error: "Payment screenshot must be a JPG, PNG, or WebP image." };
  }

  // Fetch event and verify registration type and fee
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event || event.status !== "PUBLISHED") {
    return { error: "This event is currently not open for registration." };
  }

  if (
    (event.registrationType === "SOLO" && registrationType !== "SOLO") ||
    (event.registrationType === "TEAM" && registrationType !== "TEAM")
  ) {
    return { error: `Invalid registration type for ${event.name}.` };
  }

  // Calculate fee server-side
  const fee = registrationType === "SOLO" ? event.soloFee : event.teamFee;

  // Generate registration UUID
  const regId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Upload Payment Screenshot to Neon Object Storage
  const screenshotBuffer = Buffer.from(await paymentScreenshot.arrayBuffer());
  const screenshotPath = await uploadPaymentScreenshot(
    regId,
    screenshotBuffer,
    paymentScreenshot.type
  );

  // Generate unique Registration QR code
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/verify/${regId}`;
  const qrBuffer = await QRCode.toBuffer(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
    color: {
      dark: "#111111",
      light: "#FFFFFF",
    },
  });

  const qrStoragePath = await uploadRegistrationQr(regId, qrBuffer);

  // Insert Registration row
  const [newRegistration] = await db
    .insert(registrations)
    .values({
      id: regId,
      eventId: event.id,
      participantId: session.user.id,
      registrationType,
      teamName,
      fee,
      utrNumber,
      paymentScreenshotPath: screenshotPath,
      registrationQrData: verificationUrl,
      registrationQrStoragePath: qrStoragePath,
      status: "PENDING",
      attended: false,
    })
    .returning();

  // If team, insert members
  if (registrationType === "TEAM") {
    const memberCount = parseInt((formData.get("memberCount") as string) || "0", 10);
    const membersToInsert = [];

    for (let i = 0; i < memberCount; i++) {
      const name = formData.get(`member_${i}_name`) as string;
      const rollNumber = formData.get(`member_${i}_rollNumber`) as string;
      const email = formData.get(`member_${i}_email`) as string;
      const phone = formData.get(`member_${i}_phone`) as string;
      const year = formData.get(`member_${i}_year`) as string;
      const department = formData.get(`member_${i}_department`) as string;

      if (name && rollNumber && email && phone) {
        membersToInsert.push({
          registrationId: newRegistration.id,
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          email: email.trim(),
          phone: phone.trim(),
          year: year || null,
          department: department || null,
        });
      }
    }

    if (membersToInsert.length > 0) {
      await db.insert(registrationMembers).values(membersToInsert);
    }
  }

  redirect(`/dashboard/registrations/${newRegistration.id}`);
}

export async function approveRegistrationAction(id: string): Promise<{ success: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  await db
    .update(registrations)
    .set({ status: "APPROVED", rejectionReason: null, updatedAt: new Date() })
    .where(eq(registrations.id, id));

  revalidatePath("/admin/registrations");
  revalidatePath(`/admin/registrations/${id}`);
  revalidatePath("/manager/events");
  return { success: true };
}

export async function rejectRegistrationAction(
  id: string,
  rejectionReason = "Payment verification unsuccessful or invalid details"
): Promise<{ success: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  await db
    .update(registrations)
    .set({ status: "REJECTED", rejectionReason, updatedAt: new Date() })
    .where(eq(registrations.id, id));

  revalidatePath("/admin/registrations");
  revalidatePath(`/admin/registrations/${id}`);
  revalidatePath("/manager/events");
  return { success: true };
}

export async function checkInParticipantAction(id: string): Promise<{ success: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  await db
    .update(registrations)
    .set({ attended: true, updatedAt: new Date() })
    .where(eq(registrations.id, id));

  revalidatePath("/admin/registrations");
  revalidatePath(`/verify/${id}`);
  return { success: true };
}

export async function addTeamMemberAction(data: {
  registrationId: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  year?: string | null;
  department?: string | null;
}): Promise<{ success?: boolean; error?: string; memberId?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  const { registrationId, name, rollNumber, email, phone, year, department } = data;

  if (!name?.trim() || !rollNumber?.trim() || !email?.trim() || !phone?.trim()) {
    return { error: "Name, roll number, email, and phone number are required." };
  }

  // Get registration and event
  const [reg] = await db
    .select({
      registration: registrations,
      event: events,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.id, registrationId))
    .limit(1);

  if (!reg) {
    return { error: "Registration not found." };
  }

  // Fetch current members count
  const currentMembers = await db
    .select()
    .from(registrationMembers)
    .where(eq(registrationMembers.registrationId, registrationId));

  // Total team size is captain (1) + existing members
  const currentTotal = currentMembers.length + 1;
  const maxTeamSize = reg.event.maxTeamSize;

  if (currentTotal >= maxTeamSize) {
    return {
      error: `Maximum team size limit reached (${maxTeamSize} members allowed including captain).`,
    };
  }

  // Insert member
  const [newMember] = await db
    .insert(registrationMembers)
    .values({
      registrationId,
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      year: year?.trim() || null,
      department: department?.trim() || null,
    })
    .returning();

  // If registration was SOLO, auto-switch to TEAM
  if (reg.registration.registrationType !== "TEAM") {
    await db
      .update(registrations)
      .set({
        registrationType: "TEAM",
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, registrationId));
  } else {
    await db
      .update(registrations)
      .set({ updatedAt: new Date() })
      .where(eq(registrations.id, registrationId));
  }

  revalidatePath(`/admin/registrations/${registrationId}`);
  revalidatePath("/admin/registrations");
  revalidatePath(`/dashboard/registrations/${registrationId}`);
  revalidatePath(`/manager/events/${reg.event.id}/registrations`);

  return { success: true, memberId: newMember.id };
}

export async function updateTeamMemberAction(data: {
  memberId: string;
  registrationId: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  year?: string | null;
  department?: string | null;
}): Promise<{ success?: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  const { memberId, registrationId, name, rollNumber, email, phone, year, department } = data;

  if (!name?.trim() || !rollNumber?.trim() || !email?.trim() || !phone?.trim()) {
    return { error: "Name, roll number, email, and phone number are required." };
  }

  await db
    .update(registrationMembers)
    .set({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      year: year?.trim() || null,
      department: department?.trim() || null,
    })
    .where(eq(registrationMembers.id, memberId));

  await db
    .update(registrations)
    .set({ updatedAt: new Date() })
    .where(eq(registrations.id, registrationId));

  const [reg] = await db
    .select({ eventId: registrations.eventId })
    .from(registrations)
    .where(eq(registrations.id, registrationId))
    .limit(1);

  revalidatePath(`/admin/registrations/${registrationId}`);
  revalidatePath("/admin/registrations");
  revalidatePath(`/dashboard/registrations/${registrationId}`);
  if (reg) {
    revalidatePath(`/manager/events/${reg.eventId}/registrations`);
  }

  return { success: true };
}

export async function deleteTeamMemberAction(data: {
  memberId: string;
  registrationId: string;
}): Promise<{ success?: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  const { memberId, registrationId } = data;

  // Get registration and event
  const [reg] = await db
    .select({
      registration: registrations,
      event: events,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.id, registrationId))
    .limit(1);

  if (!reg) {
    return { error: "Registration not found." };
  }

  // Fetch current members
  const currentMembers = await db
    .select()
    .from(registrationMembers)
    .where(eq(registrationMembers.registrationId, registrationId));

  // If deleting would drop total team size below minTeamSize
  // Captain (1) + remaining members (currentMembers.length - 1)
  const remainingTotal = currentMembers.length; // after removing this member, captain (1) + (length - 1) = length
  const minTeamSize = reg.event.minTeamSize;

  if (remainingTotal < minTeamSize) {
    return {
      error: `Cannot delete member: Minimum team size for this event is ${minTeamSize} (including captain).`,
    };
  }

  await db
    .delete(registrationMembers)
    .where(eq(registrationMembers.id, memberId));

  await db
    .update(registrations)
    .set({ updatedAt: new Date() })
    .where(eq(registrations.id, registrationId));

  revalidatePath(`/admin/registrations/${registrationId}`);
  revalidatePath("/admin/registrations");
  revalidatePath(`/dashboard/registrations/${registrationId}`);
  revalidatePath(`/manager/events/${reg.event.id}/registrations`);

  return { success: true };
}

export async function updateRegistrationTeamNameAction(data: {
  registrationId: string;
  teamName: string;
}): Promise<{ success?: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  const { registrationId, teamName } = data;

  await db
    .update(registrations)
    .set({
      teamName: teamName.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, registrationId));

  revalidatePath(`/admin/registrations/${registrationId}`);
  revalidatePath("/admin/registrations");

  return { success: true };
}

export async function convertToTeamRegistrationAction(
  registrationId: string
): Promise<{ success?: boolean; error?: string }> {
  const { requireManager } = await import("@/lib/auth/permissions");
  const { revalidatePath } = await import("next/cache");
  await requireManager();

  await db
    .update(registrations)
    .set({
      registrationType: "TEAM",
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, registrationId));

  revalidatePath(`/admin/registrations/${registrationId}`);
  revalidatePath("/admin/registrations");

  return { success: true };
}

