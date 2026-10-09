import { requireAuth } from "@/lib/auth/permissions";
import { getParticipantDashboardStats } from "@/db/queries/dashboard";
import { getRegistrationsByParticipant } from "@/db/queries/registrations";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await getParticipantDashboardStats(user.id);
  const myRegistrations = await getRegistrationsByParticipant(user.id);

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            PARTICIPANT DASHBOARD
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-[#FFF9EF]/70">
            {user.college || "Aroha 2K26 Participant"} • {user.department || "General"}
          </p>
        </div>

        <Link
          href="/events"
          className="px-6 py-3 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all shrink-0"
        >
          Browse All Events →
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#1A1512] border border-white/10 rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-2">
            My Registrations
          </span>
          <strong className="font-serif text-4xl font-bold text-white block">
            {stats.registeredCount}
          </strong>
        </div>

        <div className="bg-[#1A1512] border border-white/10 rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-2">
            Approved Passes
          </span>
          <strong className="font-serif text-4xl font-bold text-emerald-400 block">
            {stats.approvedCount}
          </strong>
        </div>

        <div className="bg-[#1A1512] border border-white/10 rounded-lg p-6">
          <span className="text-[11px] font-bold tracking-wider text-[#FFF9EF]/60 uppercase block mb-2">
            Certificates Earned
          </span>
          <strong className="font-serif text-4xl font-bold text-[#E5BE45] block">
            {stats.certificatesCount}
          </strong>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-[#1A1512] border border-white/10 rounded-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-white">
            Recent Event Registrations
          </h2>
          <Link
            href="/dashboard/registrations"
            className="text-xs font-bold text-[#E5BE45] hover:underline uppercase tracking-wider"
          >
            View All →
          </Link>
        </div>

        {myRegistrations.length === 0 ? (
          <div className="text-center py-12 text-[#FFF9EF]/50 text-sm">
            You haven&apos;t registered for any events yet.
            <div className="mt-3">
              <Link
                href="/events"
                className="text-xs text-[#E5BE45] font-bold uppercase tracking-wider hover:underline"
              >
                Register for your first event →
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#FFF9EF]/60 uppercase tracking-wider">
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Fee</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myRegistrations.slice(0, 5).map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02]">
                    <td className="py-4">
                      <strong className="text-white text-sm block">
                        {reg.event.name}
                      </strong>
                      <span className="text-[10px] text-[#E5BE45]">
                        {reg.event.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-[#FFF9EF]/80 font-medium">
                      {reg.registrationType}
                    </td>
                    <td className="py-4 text-[#FFF9EF]/80">₹{reg.fee}</td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
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
                        href={`/dashboard/registrations/${reg.id}`}
                        className="text-xs text-[#E5BE45] font-bold hover:underline"
                      >
                        View Pass →
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
