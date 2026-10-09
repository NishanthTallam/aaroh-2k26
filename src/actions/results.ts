"use server";

import { db } from "@/db";
import { results } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireManager } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export async function recordResultAction(formData: FormData) {
  await requireManager();

  const eventId = formData.get("eventId") as string;
  const participantId = (formData.get("participantId") as string) || null;
  const registrationId = (formData.get("registrationId") as string) || null;
  const position = parseInt(formData.get("position") as string, 10);
  const score = (formData.get("score") as string) || null;
  const remarks = (formData.get("remarks") as string) || null;

  if (!eventId || isNaN(position)) {
    return { error: "Event and position are required." };
  }

  await db.insert(results).values({
    eventId,
    participantId,
    registrationId,
    position,
    score,
    remarks,
  });

  revalidatePath("/admin/results");
  revalidatePath(`/manager/events/${eventId}/results`);
  revalidatePath("/results");
  return { success: true };
}

export async function deleteResultAction(id: string, eventId: string) {
  await requireManager();

  await db.delete(results).where(eq(results.id, id));

  revalidatePath("/admin/results");
  revalidatePath(`/manager/events/${eventId}/results`);
  revalidatePath("/results");
  return { success: true };
}
