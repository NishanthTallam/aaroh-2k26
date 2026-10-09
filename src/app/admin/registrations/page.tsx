import { getAllRegistrations } from "@/db/queries/registrations";
import Link from "next/link";

interface AdminRegistrationsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminRegistrationsPage({
  searchParams,
}: AdminRegistrationsPageProps) {
  const { status } = await searchParams;
  const allRegistrations = await getAllRegistrations();

  const filteredRegistrations = status
    ? allRegistrations.filter((r) => r.status === status)
    : allRegistrations;

  const filters = [
    { label: "All Registrations", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            REGISTRATION REVIEW DESK
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            All Registrations
          </h1>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const isActive = (status || "") === f.value;
            return (
              <Link
                key={f.label}
                href={f.value ? `/admin/registrations?status=${f.value}` : "/admin/registrations"}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-[#9E1B23] text-white border border-[#E5BE45]/60"
                    : "bg-[#171310] text-[#FFF9EF]/70 border border-white/10 hover:border-white/30"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-[#171310] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        {filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#FFF9EF]/50">
            No registrations found matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#FFF9EF]/60 uppercase tracking-wider bg-[#111111]/40">
                  <th className="p-4">Reg ID / Date</th>
                  <th className="p-4">Participant</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Fee Paid</th>
                  <th className="p-4">UTR Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono">
                      <div className="text-white text-[11px]">{reg.id}</div>
                      <div className="text-[10px] text-[#FFF9EF]/50">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <strong className="text-white block">{reg.participant.name}</strong>
                      <span className="text-[#FFF9EF]/50 text-[10px]">
                        {reg.participant.college || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{reg.event.name}</div>
                      <span className="text-[10px] text-[#E5BE45]">
                        {reg.event.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 uppercase font-semibold text-[#FFF9EF]/80">
                      {reg.registrationType}
                    </td>
                    <td className="p-4">
                      <div className="text-[#E5BE45] font-semibold">₹{reg.fee}</div>
                    </td>
                    <td className="p-4 font-mono text-white text-[11px]">
                      {reg.utrNumber}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/registrations/${reg.id}`}
                        className="px-3.5 py-1.5 bg-[#9E1B23] text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-all"
                      >
                        Review Screenshot & UTR →
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
