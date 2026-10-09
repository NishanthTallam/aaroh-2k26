import { notFound } from "next/navigation";
import { getEventById } from "@/db/queries/events";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EventEditForm } from "./event-edit-form";
import Link from "next/link";

interface AdminEditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEventPage({
  params,
}: AdminEditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const managers = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "EVENT_MANAGER"));

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Link
        href={`/admin/events/${event.id}`}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        ← Back to {event.name}
      </Link>

      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
          EVENT CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Edit {event.name}
        </h1>
      </div>

      <div className="bg-[#171310] border border-[#D4A72C]/30 rounded-lg p-6 sm:p-10 shadow-2xl">
        <EventEditForm event={event} managers={managers} />
      </div>
    </div>
  );
}
