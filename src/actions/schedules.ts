"use server";

import { db } from "@/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireManager } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export async function createScheduleAction(formData: FormData) {
  await requireManager();

  const eventId = formData.get("eventId") as string;
  const venue = formData.get("venue") as string;
  const startTime = new Date(formData.get("startTime") as string);
  const endTime = new Date(formData.get("endTime") as string);
  const roundName = (formData.get("roundName") as string) || "General Round";

  if (!eventId || !venue || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return { error: "Please provide valid schedule fields." };
  }

  await db.insert(schedules).values({
    eventId,
    venue: venue.trim(),
    startTime,
    endTime,
    roundName: roundName.trim(),
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/manager/schedule");
  revalidatePath("/schedule");
  return { success: true };
}

export async function deleteScheduleAction(id: string) {
  await requireManager();

  await db.delete(schedules).where(eq(schedules.id, id));

  revalidatePath("/admin/schedule");
  revalidatePath("/manager/schedule");
  revalidatePath("/schedule");
  return { success: true };
}
