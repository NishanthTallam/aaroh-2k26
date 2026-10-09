import { requireManager } from "@/lib/auth/permissions";
import { getManagerDashboardStats } from "@/db/queries/dashboard";
import { getEventsByManager, getAllEvents } from "@/db/queries/events";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ManagerDashboardPage() {
  const user = await requireManager();

  // If ADMIN is viewing the manager portal, show either their events or all events
  const events =
    user.role === "ADMIN"
      ? await getAllEvents()
      : await getEventsByManager(user.id);

  const stats = await getManagerDashboardStats(user.id);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
          Aaroh 2K26 • Event Management Portal
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mt-1">
          Welcome, {user.name}
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Manage your assigned competitions, review participant fee submissions, and enter final results.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#171310] border border-[#D4A72C]/20 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
            Assigned Events
          </span>
          <span className="text-3xl font-serif font-bold text-white mt-2 block">
            {events.length}
          </span>
          <span className="text-[11px] text-[#E5BE45] mt-1 block">Active under your lead</span>
        </div>

        <div className="bg-[#171310] border border-[#D4A72C]/20 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
            Total Registrations
          </span>
          <span className="text-3xl font-serif font-bold text-white mt-2 block">
            {stats.registrationsCount}
          </span>
          <span className="text-[11px] text-white/50 mt-1 block">Registered participants</span>
        </div>

        <div className="bg-[#171310] border border-[#D4A72C]/20 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
            Approved Entries
          </span>
          <span className="text-3xl font-serif font-bold text-emerald-400 mt-2 block">
            {stats.approvedCount}
          </span>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Verified & confirmed</span>
        </div>

        <div className="bg-[#171310] border border-[#D4A72C]/20 p-5 rounded-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
            Pending Review
          </span>
          <span className="text-3xl font-serif font-bold text-amber-400 mt-2 block">
            {stats.pendingCount}
          </span>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Requires payment check</span>
        </div>
      </div>

      {/* Assigned Events Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              Your Assigned Competitions
            </h2>
            <p className="text-xs text-white/60">
              Select an event to review incoming participant payments or post results.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-12 text-center text-white/60">
            <span className="text-3xl block mb-2">🎪</span>
            <strong className="block text-white font-medium mb-1">
              No Events Assigned Yet
            </strong>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              The administrator has not yet assigned any events to your profile.
              Please reach out to the Aroha Fest Administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 hover:border-[#D4A72C]/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
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

                  <h3 className="font-serif text-xl font-bold text-white mt-3 group-hover:text-[#E5BE45] transition-colors">
                    {ev.name}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 mt-1">
                    {ev.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-white/70">
                    <div>
                      <span className="text-white/40 block">Registration Fee</span>
                      <strong className="text-white">
                        {ev.soloFee > 0 ? `₹${ev.soloFee}` : ev.teamFee > 0 ? `₹${ev.teamFee}` : "Free"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-white/40 block">Type & Team Size</span>
                      <strong className="text-white">
                        {ev.registrationType} {ev.maxTeamSize > 1 ? `(Max ${ev.maxTeamSize})` : ""}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  <Link
                    href={`/manager/events/${ev.id}/registrations`}
                    className="flex-1 min-w-[120px] text-center px-3 py-2 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] font-bold text-[11px] uppercase tracking-wider rounded-lg border border-[#D4A72C]/30 transition-all"
                  >
                    📝 Review Entries
                  </Link>
                  <Link
                    href={`/manager/events/${ev.id}/results`}
                    className="px-3 py-2 bg-[#1F1813] hover:bg-[#2A211B] text-[#E5BE45] font-bold text-[11px] uppercase tracking-wider rounded-lg border border-[#D4A72C]/20 transition-all"
                  >
                    🏆 Results
                  </Link>
                  <Link
                    href={`/manager/events/${ev.id}`}
                    className="px-3 py-2 bg-[#111111] hover:bg-[#1a1a1a] text-white/80 font-semibold text-[11px] uppercase tracking-wider rounded-lg border border-white/10 transition-all"
                  >
                    Overview →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
