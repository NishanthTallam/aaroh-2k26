import { requireManager } from "@/lib/auth/permissions";
import { getEventById } from "@/db/queries/events";
import { getRegistrationsByEvent } from "@/db/queries/registrations";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ManagerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireManager();
  const { id } = await params;

  const event = await getEventById(id);
  if (!event) notFound();

  // Scoped authorization: manager must be assigned or be admin
  if (event.eventManagerId !== user.id && user.role !== "ADMIN") {
    redirect("/manager/events");
  }

  const registrations = await getRegistrationsByEvent(id);
  const pendingCount = registrations.filter((r) => r.status === "PENDING").length;
  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/manager/events"
              className="text-xs text-[#E5BE45] hover:underline"
            >
              ← All Assigned Events
            </Link>
            <span className="text-white/40">•</span>
            <span className="text-xs uppercase font-bold tracking-wider text-white/60">
              {event.category}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            {event.name}
          </h1>
          <p className="text-sm text-white/60 mt-1">{event.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/manager/events/${event.id}/registrations`}
            className="px-4 py-2.5 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4A72C]/40 transition-all flex items-center gap-2"
          >
            <span>Review Registrations</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] rounded-full font-black">
                {pendingCount} PENDING
              </span>
            )}
          </Link>
          <Link
            href={`/manager/events/${event.id}/results`}
            className="px-4 py-2.5 bg-[#1F1813] hover:bg-[#2A211B] text-[#E5BE45] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4A72C]/20 transition-all"
          >
            🏆 Record Results
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#171310] border border-[#D4A72C]/20 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
            Total Entries
          </span>
          <span className="text-2xl font-serif font-bold text-white mt-1 block">
            {registrations.length}
          </span>
        </div>
        <div className="bg-[#171310] border border-[#D4A72C]/20 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
            Approved
          </span>
          <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block">
            {approvedCount}
          </span>
        </div>
        <div className="bg-[#171310] border border-[#D4A72C]/20 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
            Pending Review
          </span>
          <span className="text-2xl font-serif font-bold text-amber-400 mt-1 block">
            {pendingCount}
          </span>
        </div>
        <div className="bg-[#171310] border border-[#D4A72C]/20 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
            Registration Fee
          </span>
          <span className="text-2xl font-serif font-bold text-[#E5BE45] mt-1 block">
            {event.soloFee > 0 ? `₹${event.soloFee}` : event.teamFee > 0 ? `₹${event.teamFee}` : "Free"}
          </span>
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white border-b border-white/10 pb-2">
            Schedule & Logistics
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50">Festival Date</span>
              <span className="text-white font-medium">
                📅 {new Date(event.eventDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50">Venue</span>
              <span className="text-white font-medium">📍 {event.venue}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/50">Participation Type</span>
              <span className="text-white font-medium">
                {event.registrationType} {event.maxTeamSize > 1 ? `(Max ${event.maxTeamSize} per team)` : "(Individual)"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-white/50">Current Status</span>
              <span className="text-emerald-400 font-bold uppercase">
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white border-b border-white/10 pb-2">
            Event Description & Guidelines
          </h3>
          <p className="text-xs text-white/80 whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}
