import { requireAdmin } from "@/lib/auth/permissions";
import { getAllManagersWithAssignedEvents } from "@/db/queries/managers";
import { getAllEvents } from "@/db/queries/events";
import { ManagerCreateForm } from "./manager-form";
import { ManagerAssignControls } from "./manager-assign-controls";

export const dynamic = "force-dynamic";

export default async function AdminManagersPage() {
  await requireAdmin();

  const [managers, events] = await Promise.all([
    getAllManagersWithAssignedEvents(),
    getAllEvents(),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
            Aaroh 2K26 • Leadership
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Event Managers
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Manage faculty & student event coordinators, assign event authority, and track coverage.
          </p>
        </div>

        <ManagerCreateForm />
      </div>

      {/* Assignment Control */}
      <ManagerAssignControls
        events={events.map((e) => ({
          id: e.id,
          name: e.name,
          category: e.category,
          eventManagerId: e.eventManagerId,
        }))}
        managers={managers.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
        }))}
      />

      {/* Managers Table */}
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl overflow-hidden">
        <div className="p-4 bg-[#111111] border-b border-[#D4A72C]/20 flex justify-between items-center">
          <h3 className="font-serif text-base font-bold text-white">
            Registered Managers ({managers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14100D] border-b border-white/5 text-[#E5BE45] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Manager</th>
                <th className="px-5 py-3.5">Department & College</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Assigned Events</th>
                <th className="px-5 py-3.5 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {managers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-white/50">
                    No event managers found. Create one above to delegate event management.
                  </td>
                </tr>
              ) : (
                managers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E5BE45]/15 border border-[#E5BE45]/40 flex items-center justify-center font-bold text-[#E5BE45] text-xs shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="block text-white font-medium">
                            {m.name}
                          </strong>
                          <span className="text-[11px] text-white/50">
                            {m.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      <div>{m.department || "General Department"}</div>
                      <div className="text-[11px] text-white/50">
                        {m.college || "Aroha University"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      {m.phone || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {m.assignedEvents.length === 0 ? (
                        <span className="text-[11px] text-amber-400/80 italic">
                          No events assigned
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {m.assignedEvents.map((ev) => (
                            <span
                              key={ev.id}
                              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B1D1D]/30 border border-[#8B1D1D] text-[#FFF9EF]"
                            >
                              {ev.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-white/50 text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
