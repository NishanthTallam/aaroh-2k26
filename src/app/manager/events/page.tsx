import { requireManager } from "@/lib/auth/permissions";
import { getEventsByManager, getAllEvents } from "@/db/queries/events";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ManagerEventsPage() {
  const user = await requireManager();

  const events =
    user.role === "ADMIN"
      ? await getAllEvents()
      : await getEventsByManager(user.id);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
          Aaroh 2K26 • Competitions
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          My Assigned Events
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Complete list of events under your supervision. Review participant entries, payment proofs, and score results.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-12 text-center text-white/60">
          <span className="text-3xl block mb-2">🎪</span>
          <strong className="block text-white font-medium mb-1">
            No Events Assigned
          </strong>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Contact the festival administrator to assign you to specific competitions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-[#D4A72C]/40 transition-all"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45] px-2.5 py-0.5 rounded bg-[#E5BE45]/10 border border-[#E5BE45]/30">
                    {ev.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ev.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : ev.status === "COMPLETED"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mt-3">
                  {ev.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 mt-1">
                  {ev.description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Venue</span>
                    <span className="text-white/80 font-medium">📍 {ev.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Date</span>
                    <span className="text-white/80 font-medium">
                      📅 {new Date(ev.eventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Entry Fee</span>
                    <span className="text-[#E5BE45] font-bold">
                      {ev.soloFee > 0 ? `₹${ev.soloFee}` : ev.teamFee > 0 ? `₹${ev.teamFee}` : "Free"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase block">Participation</span>
                    <span className="text-white/80 font-medium">
                      {ev.registrationType} {ev.maxTeamSize > 1 ? `(Max ${ev.maxTeamSize})` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                <Link
                  href={`/manager/events/${ev.id}/registrations`}
                  className="flex-1 min-w-[120px] text-center px-3 py-2 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] font-bold text-[11px] uppercase tracking-wider rounded-lg border border-[#D4A72C]/30 transition-all"
                >
                  📝 Review Registrations
                </Link>
                <Link
                  href={`/manager/events/${ev.id}/results`}
                  className="px-3 py-2 bg-[#1F1813] hover:bg-[#2A211B] text-[#E5BE45] font-bold text-[11px] uppercase tracking-wider rounded-lg border border-[#D4A72C]/20 transition-all"
                >
                  🏆 Record Results
                </Link>
                <Link
                  href={`/manager/events/${ev.id}`}
                  className="px-3 py-2 bg-[#111111] hover:bg-[#1a1a1a] text-white/80 font-semibold text-[11px] uppercase tracking-wider rounded-lg border border-white/10 transition-all"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
