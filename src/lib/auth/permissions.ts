import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Profile } from "@/db/schema";

export async function requireAuth(): Promise<Profile> {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return session.user;
}

export async function requireRole(
  allowedRoles: ("ADMIN" | "EVENT_MANAGER" | "PARTICIPANT")[]
): Promise<Profile> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") redirect("/admin");
    if (user.role === "EVENT_MANAGER") redirect("/manager");
    redirect("/dashboard");
  }
  return user;
}

export async function requireAdmin(): Promise<Profile> {
  return await requireRole(["ADMIN"]);
}

export async function requireManager(): Promise<Profile> {
  return await requireRole(["ADMIN", "EVENT_MANAGER"]);
}

export async function requireParticipant(): Promise<Profile> {
  return await requireRole(["PARTICIPANT", "ADMIN"]);
}
