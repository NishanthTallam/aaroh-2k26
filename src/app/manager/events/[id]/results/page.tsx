import { requireManager } from "@/lib/auth/permissions";
import { getEventById } from "@/db/queries/events";
import { getResultsByEvent } from "@/db/queries/results";
import { getRegistrationsByEvent } from "@/db/queries/registrations";
import { EventResultControls } from "./event-result-controls";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ManagerEventResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireManager();
  const { id } = await params;

  const event = await getEventById(id);
  if (!event) notFound();

  // Scoped authorization
  if (event.eventManagerId !== user.id && user.role !== "ADMIN") {
    redirect("/manager/events");
  }

  const [resultsList, registrations] = await Promise.all([
    getResultsByEvent(id),
    getRegistrationsByEvent(id),
  ]);

  // Map approved or existing registrations for selection
  const participantOptions = registrations
    .filter((r) => r.status === "APPROVED" || r.status === "PENDING")
    .map((r) => ({
      id: r.participant.id,
      name: r.participant.name,
      college: r.participant.college,
      registrationId: r.id,
      teamName: r.teamName,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/manager/events/${event.id}`}
            className="text-xs text-[#E5BE45] hover:underline"
          >
            ← {event.name} Overview
          </Link>
          <span className="text-white/40">•</span>
          <span className="text-xs uppercase font-bold tracking-wider text-white/60">
            Hall of Fame
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Event Winners & Scoring
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Declare 1st, 2nd, and 3rd place winners for {event.name}. Winning entries are automatically published to the public festival results board.
        </p>
      </div>

      <EventResultControls
        eventId={event.id}
        results={resultsList}
        participants={participantOptions}
      />
    </div>
  );
}
