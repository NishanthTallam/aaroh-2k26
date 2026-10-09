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

