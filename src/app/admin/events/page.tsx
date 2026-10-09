import { getAllEvents } from "@/db/queries/events";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function AdminEventsPage() {
  const events = await getAllEvents();
  const allManagers = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "EVENT_MANAGER"));

  const managerMap = new Map(allManagers.map((m) => [m.id, m.name]));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            FESTIVAL CATALOG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Events Management
          </h1>
        </div>

        <Link
          href="/admin/events/new"
          className="px-5 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all"
        >
          + Create New Event
        </Link>
      </div>

      <div className="bg-[#171310] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#FFF9EF]/60 uppercase tracking-wider bg-[#111111]/40">
                <th className="p-4">Event Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type / Fees</th>
                <th className="p-4">Manager</th>
                <th className="p-4">Status</th>
                <th className="p-4">Event Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <strong className="text-white text-sm block">{ev.name}</strong>
                    <span className="text-[#FFF9EF]/50 font-mono text-[10px]">
                      /{ev.slug}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[#E5BE45] font-semibold uppercase">
                      {ev.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{ev.registrationType}</div>
                    <div className="text-[#FFF9EF]/60 text-[10px]">
                      Solo: ₹{ev.soloFee} | Team: ₹{ev.teamFee}
                    </div>
                  </td>
                  <td className="p-4 text-[#FFF9EF]/80">
                    {ev.eventManagerId
                      ? managerMap.get(ev.eventManagerId) || "Assigned"
                      : "Unassigned"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ev.status === "PUBLISHED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : ev.status === "COMPLETED"
                          ? "bg-blue-950 text-blue-400 border border-blue-800"
                          : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#FFF9EF]/80">
                    {new Date(ev.eventDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/events/${ev.id}`}
                      className="px-2.5 py-1 bg-[#111111] text-[#E5BE45] border border-[#D4A72C]/30 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-[#E5BE45] hover:text-black transition-all"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/events/${ev.id}/edit`}
                      className="px-2.5 py-1 bg-[#111111] text-white border border-white/20 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/events/${ev.id}/registrations`}
                      className="px-2.5 py-1 bg-[#9E1B23] text-white rounded text-[11px] font-bold uppercase tracking-wider hover:bg-[#C62828] transition-all"
                    >
                      Regs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
