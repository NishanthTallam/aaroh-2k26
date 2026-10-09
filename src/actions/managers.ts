"use server";

import { db } from "@/db";
import { profiles, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export type ManagerActionResult = {
  success?: boolean;
  error?: string;
};

export async function createManagerAction(
  prevState: ManagerActionResult | null,
  formData: FormData
): Promise<ManagerActionResult> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string) || "";
  const department = (formData.get("department") as string) || "";
  const college = (formData.get("college") as string) || "Aroha University";

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = hashPassword(password);
  const userId = `mgr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  await db.insert(profiles).values({
    userId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    phone: phone.trim() || null,
    college: college.trim(),
    department: department.trim() || null,
    role: "EVENT_MANAGER", // Rule 5D.3: Auto role = EVENT_MANAGER
  });

  revalidatePath("/admin/managers");
  return { success: true };
}

export async function assignEventManagerAction(
  eventId: string,
  managerId: string | null
): Promise<{ success: boolean }> {
  await requireAdmin();

  await db
    .update(events)
    .set({ eventManagerId: managerId, updatedAt: new Date() })
    .where(eq(events.id, eventId));

  revalidatePath("/admin/events");
  revalidatePath("/admin/managers");
  return { success: true };
}
