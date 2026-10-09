import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EventCreateForm } from "./event-form";
import Link from "next/link";

export default async function NewEventPage() {
  const managers = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "EVENT_MANAGER"));

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        ← Back to all events
      </Link>

      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
          EVENT CREATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Create New Festival Event
        </h1>
      </div>

      <div className="bg-[#171310] border border-[#D4A72C]/30 rounded-lg p-6 sm:p-10 shadow-2xl">
        <EventCreateForm managers={managers} />
      </div>
    </div>
  );
}
