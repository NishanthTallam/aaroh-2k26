"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { profileSchema } from "@/lib/validations/profile";
import {
  hashPassword,
  verifyPassword,
  setSession,
  clearSession,
  getSession,
} from "@/lib/auth/session";
import { redirect } from "next/navigation";

export type AuthActionResult = {
  success?: boolean;
  error?: string;
};

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, parsed.data.email.toLowerCase().trim()))
    .limit(1);

  if (!profile || !profile.passwordHash) {
    return { error: "Invalid email or password" };
  }

  const isValid = verifyPassword(parsed.data.password, profile.passwordHash);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await setSession(profile.id);

  if (profile.role === "ADMIN") {
    redirect("/admin");
  } else if (profile.role === "EVENT_MANAGER") {
    redirect("/manager");
  } else {
    redirect("/dashboard");
  }
}

export async function registerAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string) || "";
  const rollNumber = (formData.get("rollNumber") as string) || "";
  const college = (formData.get("college") as string) || "";
  const department = (formData.get("department") as string) || "";
  const year = (formData.get("year") as string) || "";

  const parsed = registerSchema.safeParse({
    name,
    email,
    password,
    phone,
    rollNumber,
    college,
    department,
    year,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, parsed.data.email.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = hashPassword(parsed.data.password);
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const [newProfile] = await db
    .insert(profiles)
    .values({
      userId,
      name: parsed.data.name.trim(),
      email: parsed.data.email.toLowerCase().trim(),
      passwordHash,
      phone: parsed.data.phone || null,
      rollNumber: parsed.data.rollNumber || null,
      college: parsed.data.college || null,
      department: parsed.data.department || null,
      year: parsed.data.year || null,
      role: "PARTICIPANT", // Rule 2A.8: Auto-assign PARTICIPANT role
    })
    .returning();

  await setSession(newProfile.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/auth/login");
}

export async function updateProfileAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const rollNumber = formData.get("rollNumber") as string;
  const college = formData.get("college") as string;
  const department = formData.get("department") as string;
  const year = formData.get("year") as string;

  const parsed = profileSchema.safeParse({
    name,
    phone,
    rollNumber,
    college,
    department,
    year,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  await db
    .update(profiles)
    .set({
      name: parsed.data.name.trim(),
      phone: parsed.data.phone.trim(),
      rollNumber: parsed.data.rollNumber.trim(),
      college: parsed.data.college.trim(),
      department: parsed.data.department.trim(),
      year: parsed.data.year.trim(),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, session.user.id));

  return { success: true };
}
