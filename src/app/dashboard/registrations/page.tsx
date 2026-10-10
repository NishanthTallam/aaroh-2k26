import { requireAuth } from "@/lib/auth/permissions";
import { getRegistrationsByParticipant } from "@/db/queries/registrations";
import Link from "next/link";

export default async function MyRegistrationsPage() {
  const user = await requireAuth();
  const myRegistrations = await getRegistrationsByParticipant(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            PARTICIPANT RECORDS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            My Event Registrations
          </h1>
        </div>

        <Link
          href="/events"
          className="px-5 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all"
        >
          + Register for Event
        </Link>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1512] rounded-lg border border-white/10 p-8">
          <p className="text-sm text-[#FFF9EF]/60 mb-4">
            You do not have any registered events yet.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            Explore Events →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRegistrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-[#1A1512] border border-[#D4A72C]/20 rounded-lg p-6 flex flex-col justify-between hover:border-[#E5BE45] transition-all shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold tracking-wider text-[#E5BE45] uppercase">
                    {reg.event.category.replace("_", " ")}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                      reg.status === "APPROVED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : reg.status === "REJECTED"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {reg.event.name}
                </h3>

                <div className="space-y-1.5 text-xs text-[#FFF9EF]/70 mb-6">
                  <div>
                    Type: <strong className="text-white">{reg.registrationType}</strong>
                    {reg.teamName && ` (${reg.teamName})`}
                  </div>
                  <div>Fee Paid: ₹{reg.fee} (UTR: {reg.utrNumber})</div>
                  <div>Venue: {reg.event.venue}</div>
                  <div>
                    Registered on: {new Date(reg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-[#FFF9EF]/50 font-mono truncate max-w-[150px]">
                  ID: {reg.id}
                </span>

                <Link
                  href={`/dashboard/registrations/${reg.id}`}
                  className="px-4 py-2 bg-[#111111] text-[#E5BE45] border border-[#D4A72C]/30 text-xs font-bold uppercase tracking-wider rounded hover:bg-[#E5BE45] hover:text-black transition-all"
                >
                  {reg.status === "APPROVED" ? "View Pass & QR →" : "View Details →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
