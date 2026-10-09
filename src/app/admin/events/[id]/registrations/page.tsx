import { notFound } from "next/navigation";
import { getEventById } from "@/db/queries/events";
import { getRegistrationsByEvent } from "@/db/queries/registrations";
import Link from "next/link";

interface EventRegistrationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEventRegistrationsPage({
  params,
}: EventRegistrationsPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const registrations = await getRegistrationsByEvent(id);

  return (
    <div className="space-y-8">
      <Link
        href={`/admin/events/${event.id}`}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        ← Back to {event.name}
      </Link>

      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
          EVENT REGISTRATIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Registrations for {event.name}
        </h1>
        <p className="text-xs text-[#FFF9EF]/70 mt-1">
          Total Entries: {registrations.length}
        </p>
      </div>

      <div className="bg-[#171310] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        {registrations.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#FFF9EF]/50">
            No participants have registered for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#FFF9EF]/60 uppercase tracking-wider bg-[#111111]/40">
                  <th className="p-4">Reg ID</th>
                  <th className="p-4">Participant</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Fee Paid</th>
                  <th className="p-4">UTR Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-white text-[11px]">{reg.id}</td>
                    <td className="p-4">
                      <strong className="text-white block">{reg.participant.name}</strong>
                      <span className="text-[#FFF9EF]/50 text-[10px]">
                        {reg.participant.college}
                      </span>
                    </td>
                    <td className="p-4 uppercase font-semibold text-[#FFF9EF]/80">
                      {reg.registrationType}
                    </td>
                    <td className="p-4 font-semibold text-[#E5BE45]">₹{reg.fee}</td>
                    <td className="p-4 font-mono text-[#FFF9EF]/80">{reg.utrNumber}</td>
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
                        className="px-3 py-1 bg-[#9E1B23] text-white text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-all"
                      >
                        Review Entry →
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
