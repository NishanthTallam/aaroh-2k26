import { getFestivalCoordinators } from "@/db/queries/managers";
import Link from "next/link";
import { UserCheck, Calendar, Mail, Phone, ArrowRight } from "lucide-react";

interface CoordinatorItem {
  id: string;
  name: string;
  role?: string;
  department?: string | null;
  college?: string | null;
  email?: string | null;
  phone?: string | null;
  badge?: string;
  isHead?: boolean;
  assignedEvents?: Array<{ id: string; name: string }>;
}

export async function Coordinators() {
  const staff = await getFestivalCoordinators();

  // Head Coordinator (Madam Ramya krishna G - Head of students life and clubs)
  const headCoordinator: CoordinatorItem = {
    id: "head-ramya-krishna-g",
    name: "Ramya krishna G",
    role: "HEAD",
    department: "Head of students life and clubs",
    college: "Sanskrithi Group of Institutions",
    phone: "+91 95333 13133",
    email: "ramyakrishna.g@sseptp.org",
    badge: "HEAD - STUDENT LIFE & CLUBS",
    isHead: true,
    assignedEvents: [],
  };

  // Combine Head Coordinator at the top with festival coordinators from database
  const allCoordinators: CoordinatorItem[] = [
    headCoordinator,
    ...staff.filter((c) => !c.name?.toLowerCase().includes("ramya krishna")),
  ];

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
          <span>View All Competitions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Coordinators Cards List */}
      <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
        {allCoordinators.map((coord) => (
          <div
            key={coord.id}
            className={`p-5 rounded-xl transition-all shadow-lg flex flex-col justify-between space-y-3 group ${
              coord.isHead
                ? "bg-gradient-to-r from-[#1c1611] to-[#14100d] border border-[#E5BE45]/60 hover:border-[#E5BE45] shadow-[0_4px_20px_rgba(229,190,69,0.12)]"
                : "bg-[#171310] border border-[#D4A72C]/25 hover:border-[#E5BE45]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-base shrink-0 group-hover:scale-105 transition-transform ${
                    coord.isHead
                      ? "bg-[#E5BE45]/25 border border-[#E5BE45] text-[#E5BE45] shadow-[0_0_12px_rgba(229,190,69,0.3)]"
                      : "bg-[#E5BE45]/15 border border-[#E5BE45]/40 text-[#E5BE45]"
                  }`}
                >
                  {coord.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="block text-white text-sm font-semibold group-hover:text-[#E5BE45] transition-colors">
                    {coord.name}
                  </strong>
                  <span className="text-[11px] text-white/60 block">
                    {coord.department || "Faculty Lead"}
                    {coord.college ? ` • ${coord.college}` : ""}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border whitespace-nowrap ${
                  coord.isHead
                    ? "bg-[#E5BE45]/15 text-[#E5BE45] border-[#E5BE45]/60 font-semibold"
                    : coord.role === "ADMIN"
                    ? "bg-[#9E1B23]/30 text-[#E5BE45] border-[#9E1B23]"
                    : "bg-[#9E1B23]/30 text-[#E5BE45] border-[#9E1B23]"
                }`}
              >
                {coord.badge || (coord.role === "ADMIN" ? "CONVENER" : "EVENT LEAD")}
              </span>
            </div>

            {/* Assigned Events Badges */}
            {coord.assignedEvents && coord.assignedEvents.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {coord.assignedEvents.map((ev) => (
                  <span
                    key={ev.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#111111] border border-white/10 text-white/80 font-medium inline-flex items-center gap-1"
                  >
                    <Calendar className="w-2.5 h-2.5 text-[#E5BE45]" />
                    <span>{ev.name}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Contact Links */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              {coord.email ? (
                <a
                  href={`mailto:${coord.email}`}
                  className="text-white/70 hover:text-[#E5BE45] transition-colors inline-flex items-center gap-1.5 text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5BE45]" />
                  <span>{coord.email}</span>
                </a>
              ) : (
                <span className="text-[11px] text-[#E5BE45]/70 italic">Campus Leadership</span>
              )}

              {coord.phone && (
                <a
                  href={`tel:${coord.phone.replace(/\s+/g, "")}`}
                  className="text-[#E5BE45] hover:underline inline-flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Phone className="w-3 h-3 text-[#E5BE45]" />
                  <span>{coord.phone}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
