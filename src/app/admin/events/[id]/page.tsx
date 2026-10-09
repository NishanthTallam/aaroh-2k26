import { notFound } from "next/navigation";
import { getEventById } from "@/db/queries/events";
import { getRegistrationsByEvent } from "@/db/queries/registrations";
import { togglePublishEventAction, markEventCompletedAction } from "@/actions/events";
import Link from "next/link";
import { MapPin, Calendar, Trophy, ArrowLeft } from "lucide-react";

interface AdminEventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEventDetailPage({
  params,
}: AdminEventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const registrations = await getRegistrationsByEvent(id);
  const pendingCount = registrations.filter((r) => r.status === "PENDING").length;
  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;
  const totalRevenue = registrations
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + r.fee, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all events</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-[#171310] border border-[#D4A72C]/30 rounded-lg p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase">
              {event.category.replace("_", " ")}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                event.status === "PUBLISHED"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : event.status === "COMPLETED"
                  ? "bg-blue-950 text-blue-400 border border-blue-800"
                  : "bg-neutral-800 text-neutral-300 border border-neutral-700"
              }`}
            >
              {event.status}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
            {event.name}
          </h1>

          <div className="text-xs text-[#FFF9EF]/70 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E5BE45]" />
              <span>{event.venue}</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#E5BE45]" />
              <span>{new Date(event.eventDate).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="px-4 py-2 bg-[#111111] text-white border border-white/20 rounded text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
          >
            Edit
          </Link>

          <Link
            href={`/admin/events/${event.id}/registrations`}
            className="px-4 py-2 bg-[#111111] text-[#E5BE45] border border-[#D4A72C]/30 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#E5BE45] hover:text-black transition-all"
          >
            Registrations ({registrations.length})
          </Link>

          {event.status === "DRAFT" ? (
            <form
              action={async () => {
                "use server";
                await togglePublishEventAction(event.id, "PUBLISHED");
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-900 text-emerald-200 border border-emerald-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all"
              >
                Publish Event
              </button>
            </form>
          ) : event.status === "PUBLISHED" ? (
            <form
              action={async () => {
                "use server";
                await togglePublishEventAction(event.id, "DRAFT");
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition-all"
              >
                Unpublish
              </button>
            </form>
          ) : null}

          {event.status !== "COMPLETED" && (
            <form
              action={async () => {
                "use server";
                await markEventCompletedAction(event.id);
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9E1B23] text-white border border-[#E5BE45]/30 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#C62828] transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-[#171310] rounded-lg border border-white/10">
          <span className="text-[10px] text-[#FFF9EF]/60 uppercase tracking-wider block mb-1">
            Total Entries
          </span>
          <strong className="font-serif text-2xl font-bold text-white">
            {registrations.length}
          </strong>
        </div>

        <div className="p-5 bg-[#171310] rounded-lg border border-amber-600/30">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-1">
            Pending Review
          </span>
          <strong className="font-serif text-2xl font-bold text-amber-400">
            {pendingCount}
          </strong>
        </div>

        <div className="p-5 bg-[#171310] rounded-lg border border-emerald-600/30">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
            Approved Passes
          </span>
          <strong className="font-serif text-2xl font-bold text-emerald-400">
            {approvedCount}
          </strong>
        </div>

        <div className="p-5 bg-[#171310] rounded-lg border border-white/10">
          <span className="text-[10px] text-[#E5BE45] uppercase tracking-wider block mb-1">
            Revenue Collected
          </span>
          <strong className="font-serif text-2xl font-bold text-[#E5BE45]">
            ₹{totalRevenue.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Description & Rules */}
      <div className="bg-[#171310] border border-white/10 rounded-lg p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-2">
            Event Description
          </h3>
          <p className="text-sm text-[#FFF9EF]/80 leading-relaxed">
            {event.description}
          </p>
        </div>

        {event.rules && (
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-2">
              Rules & Guidelines
            </h3>
            <div className="text-xs text-[#FFF9EF]/70 leading-relaxed whitespace-pre-line">
              {event.rules}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
