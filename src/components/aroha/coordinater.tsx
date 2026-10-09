import { getFestivalCoordinators } from "@/db/queries/managers";
import Link from "next/link";

export async function Coordinators() {
  const staff = await getFestivalCoordinators();

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div>
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
          FESTIVAL COORDINATORS
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-[#FFF9EF] mb-4">
          EVENT <span className="text-[#E5BE45]">LEADERSHIP.</span>
        </h2>
        <p className="text-[#FFF9EF]/70 text-base mb-6 max-w-md">
          Connect directly with our faculty coordinators and event managers for competition guidelines, timings, and campus assistance.
        </p>

        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] border-b border-[#D4A72C] pb-1 hover:text-white hover:border-white transition-all mb-4"
        >
          View All Competitions →
        </Link>
      </div>

      {/* Coordinators Cards List */}
      <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
        {staff.length === 0 ? (
          <div className="p-6 bg-[#171310] border border-[#D4A72C]/30 rounded-xl text-center">
            <span className="text-2xl block mb-2">👔</span>
            <strong className="block text-white text-sm">Festival Helpdesk</strong>
            <span className="text-xs text-white/60 block mt-1">
              helpdesk@aroha2k26.com • +91 98765 43210
            </span>
          </div>
        ) : (
          staff.map((coord) => (
            <div
              key={coord.id}
              className="bg-[#171310] border border-[#D4A72C]/25 hover:border-[#E5BE45] p-5 rounded-xl transition-all shadow-lg flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5BE45]/15 border border-[#E5BE45]/40 flex items-center justify-center font-serif font-bold text-[#E5BE45] text-base shrink-0 group-hover:scale-105 transition-transform">
                    {coord.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong className="block text-white text-sm font-semibold group-hover:text-[#E5BE45] transition-colors">
                      {coord.name}
                    </strong>
                    <span className="text-[11px] text-white/50 block">
                      {coord.department || "Faculty Lead"} • {coord.college || "Sanskrithi Institutions"}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#9E1B23]/30 text-[#E5BE45] border border-[#9E1B23]">
                  {coord.role === "ADMIN" ? "CONVENER" : "EVENT LEAD"}
                </span>
              </div>

              {/* Assigned Events Badges */}
              {coord.assignedEvents && coord.assignedEvents.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {coord.assignedEvents.map((ev) => (
                    <span
                      key={ev.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#111111] border border-white/10 text-white/80 font-medium"
                    >
                      🎪 {ev.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact Links */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a
                  href={`mailto:${coord.email}`}
                  className="text-white/70 hover:text-[#E5BE45] transition-colors inline-flex items-center gap-1.5 text-[11px]"
                >
                  <span>✉</span>
                  <span>{coord.email}</span>
                </a>

                {coord.phone && (
                  <a
                    href={`tel:${coord.phone}`}
                    className="text-[#E5BE45] hover:underline inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <span>📞</span>
                    <span>{coord.phone}</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
