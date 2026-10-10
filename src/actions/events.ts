"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, requireManager } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type EventActionResult = {
  success?: boolean;
  error?: string;
  eventId?: string;
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        // Exponential backoff to give serverless DB time to wake up
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

export async function createEventAction(
  prevState: EventActionResult | null,
  formData: FormData
): Promise<EventActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const category = formData.get("category") as
    | "CULTURAL"
    | "SPORTS"
    | "CREATIVE_MEDIA"
    | "FOOD_FEST";
  const description = formData.get("description") as string;
  const rules = (formData.get("rules") as string) || "";
  const venue = formData.get("venue") as string;
  const registrationType = formData.get("registrationType") as
    | "SOLO"
    | "TEAM"
    | "BOTH";
  const soloFee = parseInt((formData.get("soloFee") as string) || "0", 10);
  const teamFee = parseInt((formData.get("teamFee") as string) || "0", 10);
  const minTeamSize = parseInt((formData.get("minTeamSize") as string) || "1", 10);
  const maxTeamSize = parseInt((formData.get("maxTeamSize") as string) || "1", 10);
  const registrationOpen = new Date(formData.get("registrationOpen") as string);
  const registrationClose = new Date(formData.get("registrationClose") as string);
  const eventDate = new Date(formData.get("eventDate") as string);
  
  // Strictly sanitize eventManagerId to null if empty string or not selected
  const rawManagerId = formData.get("eventManagerId") as string | null;
  const eventManagerId = rawManagerId && rawManagerId.trim() !== "" ? rawManagerId.trim() : null;

  const status = (formData.get("status") as "DRAFT" | "PUBLISHED") || "DRAFT";
  
  const rawImageUrl = formData.get("imageUrl") as string | null;
  const imageUrl = rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl.trim() : null;

  if (!name || !category || !description || !venue || !registrationType) {
    return { error: "Please fill in all required event details." };
  }

  const baseSlug = generateSlug(name);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  let newEventId: string;
  try {
    const [newEvent] = await withRetry(() =>
      db
        .insert(events)
        .values({
          name: name.trim(),
          slug,
          category,
          description: description.trim(),
          rules: rules.trim(),
          venue: venue.trim(),
          registrationType,
          soloFee: isNaN(soloFee) ? 0 : soloFee,
          teamFee: isNaN(teamFee) ? 0 : teamFee,
          minTeamSize: isNaN(minTeamSize) ? 1 : minTeamSize,
          maxTeamSize: isNaN(maxTeamSize) ? 1 : maxTeamSize,
          registrationOpen,
          registrationClose,
          eventDate,
          eventManagerId,
          status,
          imageUrl: imageUrl ?? undefined,
        })
        .returning()
    );
    newEventId = newEvent.id;
  } catch (err: unknown) {
    console.error("Failed to insert event in database:", err);
    return {
      error:
        err instanceof Error
          ? `Database connection issue: ${err.message}. Please click Create Event again.`
          : "Failed to create event. Please try again.",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${newEventId}`);
}

export async function updateEventAction(
  prevState: EventActionResult | null,
  formData: FormData
): Promise<EventActionResult> {
  const user = await requireManager();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as
    | "CULTURAL"
    | "SPORTS"
    | "CREATIVE_MEDIA"
    | "FOOD_FEST";
  const description = formData.get("description") as string;
  const rules = (formData.get("rules") as string) || "";
  const venue = formData.get("venue") as string;
  const registrationType = formData.get("registrationType") as
    | "SOLO"
    | "TEAM"
    | "BOTH";
  const soloFee = parseInt((formData.get("soloFee") as string) || "0", 10);
  const teamFee = parseInt((formData.get("teamFee") as string) || "0", 10);
  const minTeamSize = parseInt((formData.get("minTeamSize") as string) || "1", 10);
  const maxTeamSize = parseInt((formData.get("maxTeamSize") as string) || "1", 10);
  const registrationOpen = new Date(formData.get("registrationOpen") as string);
  const registrationClose = new Date(formData.get("registrationClose") as string);
  const eventDate = new Date(formData.get("eventDate") as string);
  
  const rawManagerId = formData.get("eventManagerId") as string | null;
  const eventManagerId = rawManagerId && rawManagerId.trim() !== "" ? rawManagerId.trim() : null;

  const status = formData.get("status") as "DRAFT" | "PUBLISHED" | "COMPLETED";
  
  const rawImageUrl = formData.get("imageUrl") as string | null;
  const imageUrl = rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl.trim() : null;

  // Check event ownership if not admin
  if (user.role !== "ADMIN") {
    const [existing] = await db.select().from(events).where(eq(events.id, id));
    if (!existing || existing.eventManagerId !== user.id) {
      return { error: "You are not authorized to edit this event." };
    }
  }

  try {
    await withRetry(() =>
      db
        .update(events)
        .set({
          name: name.trim(),
          category,
          description: description.trim(),
          rules: rules.trim(),
          venue: venue.trim(),
          registrationType,
          soloFee: isNaN(soloFee) ? 0 : soloFee,
          teamFee: isNaN(teamFee) ? 0 : teamFee,
          minTeamSize: isNaN(minTeamSize) ? 1 : minTeamSize,
          maxTeamSize: isNaN(maxTeamSize) ? 1 : maxTeamSize,
          registrationOpen,
          registrationClose,
          eventDate,
          eventManagerId: user.role === "ADMIN" ? eventManagerId : undefined,
          status,
          imageUrl: imageUrl ?? undefined,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
    );
  } catch (err: unknown) {
    console.error("Failed to update event in database:", err);
    return {
      error:
        err instanceof Error
          ? `Database connection issue: ${err.message}`
          : "Failed to update event. Please try again.",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/admin/events/${id}`);
  redirect(`/admin/events/${id}`);
}

export async function deleteEventAction(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function togglePublishEventAction(
  id: string,
  newStatus: "DRAFT" | "PUBLISHED"
): Promise<{ success: boolean }> {
  await requireAdmin();

  await db
    .update(events)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(events.id, id));

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/events");
  return { success: true };
}

export async function markEventCompletedAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  await db
    .update(events)
    .set({ status: "COMPLETED", updatedAt: new Date() })
    .where(eq(events.id, id));

  try {
    const { generateAllEventCertificatesAction } = await import("./certificates");
    await generateAllEventCertificatesAction(id);
  } catch (err) {
    console.error("Auto certificate generation error:", err);
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/events");
  revalidatePath("/results");
  revalidatePath("/dashboard/certificates");
  return { success: true };
}
