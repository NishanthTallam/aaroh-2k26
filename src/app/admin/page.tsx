import { getAdminDashboardStats } from "@/db/queries/dashboard";
import { getAllRegistrations } from "@/db/queries/registrations";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const allRegistrations = await getAllRegistrations();
  const recentRegistrations = allRegistrations.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            AROHA FESTIVAL ADMINISTRATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Event Control Center
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/events/new"
            className="px-4 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all"
          >
            + Create Event
          </Link>
          <Link
            href="/admin/registrations"
            className="px-4 py-2.5 bg-[#171310] text-[#E5BE45] text-xs font-bold uppercase tracking-wider rounded border border-[#D4A72C]/30 hover:bg-[#E5BE45] hover:text-black transition-all"
          >
            Review Pending ({stats.pendingRegistrations})
          </Link>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-[#171310] border border-white/10 rounded-lg p-5">
          <span className="text-[10px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-1">
            Total Revenue
          </span>
          <strong className="font-serif text-2xl sm:text-3xl font-bold text-[#E5BE45] block">
            ₹{stats.totalRevenue.toLocaleString()}
          </strong>
        </div>

        <div className="bg-[#171310] border border-white/10 rounded-lg p-5">
          <span className="text-[10px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-1">
            Total Registrations
          </span>
          <strong className="font-serif text-2xl sm:text-3xl font-bold text-white block">
            {stats.totalRegistrations}
          </strong>
        </div>

        <div className="bg-[#171310] border border-amber-600/30 rounded-lg p-5">
          <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block mb-1">
            Pending Review
          </span>
          <strong className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">
            {stats.pendingRegistrations}
          </strong>
        </div>

        <div className="bg-[#171310] border border-emerald-600/30 rounded-lg p-5">
          <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase block mb-1">
            Approved Passes
          </span>
          <strong className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 block">
            {stats.approvedRegistrations}
          </strong>
        </div>

        <div className="bg-[#171310] border border-white/10 rounded-lg p-5 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-1">
            Active Events
          </span>
          <strong className="font-serif text-2xl sm:text-3xl font-bold text-white block">
            {stats.totalEvents}
          </strong>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-[#171310] border border-white/10 rounded-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-white">
            Recent Registration Activity
          </h2>
          <Link
            href="/admin/registrations"
            className="text-xs font-bold text-[#E5BE45] uppercase tracking-wider hover:underline"
          >
            View All Registrations →
          </Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="text-center py-12 text-[#FFF9EF]/50 text-sm">
            No registrations received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#FFF9EF]/60 uppercase tracking-wider">
                  <th className="pb-3">ID / Date</th>
                  <th className="pb-3">Participant</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Fee (UTR)</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 font-mono">
                      <div className="text-white">{reg.id}</div>
                      <div className="text-[10px] text-[#FFF9EF]/50">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <strong className="text-white block">{reg.participant.name}</strong>
                      <span className="text-[#FFF9EF]/60">{reg.participant.college}</span>
                    </td>
                    <td className="py-4">
                      <div className="text-white font-medium">{reg.event.name}</div>
                      <span className="text-[10px] text-[#E5BE45]">
                        {reg.event.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 uppercase font-semibold text-[#FFF9EF]/80">
                      {reg.registrationType}
                    </td>
                    <td className="py-4">
                      <div className="text-[#E5BE45] font-semibold">₹{reg.fee}</div>
                      <div className="font-mono text-[10px] text-[#FFF9EF]/50">
                        {reg.utrNumber}
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          reg.status === "APPROVED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : reg.status === "REJECTED"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/registrations/${reg.id}`}
                        className="px-3 py-1.5 bg-[#9E1B23] text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-all"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
