import { requireAuth } from "@/lib/auth/permissions";
import { getCertificatesByParticipant } from "@/db/queries/participants";
import { getRegistrationsByParticipant } from "@/db/queries/registrations";
import { getFileViewUrl } from "@/lib/storage/certificates";
import { CertificateClaimButton } from "./certificate-claim-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const user = await requireAuth();

  const [certs, registrations] = await Promise.all([
    getCertificatesByParticipant(user.id),
    getRegistrationsByParticipant(user.id),
  ]);

  // Find completed events where user was approved and hasn't claimed yet
  const certEventIds = new Set(certs.map((c) => c.eventId));
  const claimable = registrations.filter(
    (r) =>
      r.status === "APPROVED" &&
      r.event.status === "COMPLETED" &&
      !certEventIds.has(r.eventId)
  );

  // Generate view URLs for available certificates from aaroh-public
  const certsWithUrls = await Promise.all(
    certs.map(async (c) => {
      let url = "#";
      try {
        url = await getFileViewUrl(c.storagePath);
      } catch {
        url = "#";
      }
      return { ...c, downloadUrl: url };
    })
  );

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
          ACHIEVEMENTS & PARTICIPATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          My Certificates
        </h1>
        <p className="text-xs text-[#FFF9EF]/70 mt-1">
          Official certificates are securely stored in Neon Object Storage and verified for festival participants.
        </p>
      </div>

      {/* Claimable section if any */}
      {claimable.length > 0 && (
        <div className="bg-[#171310] border-2 border-[#E5BE45]/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Certificates Ready to Claim ({claimable.length})
              </h3>
              <p className="text-xs text-[#FFF9EF]/60">
                These events have concluded. Claim and generate your official verified PDF certificate now.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {claimable.map((reg) => (
              <div
                key={reg.id}
                className="bg-[#111111] border border-white/10 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <strong className="block text-white text-sm">
                    {reg.event.name}
                  </strong>
                  <span className="text-[11px] text-[#E5BE45]">
                    {reg.event.category} • {reg.registrationType}
                  </span>
                </div>
                <CertificateClaimButton eventId={reg.eventId} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issued Certificates List */}
      {certsWithUrls.length === 0 && claimable.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1512] rounded-lg border border-white/10 p-8">
          <div className="text-4xl mb-4">📜</div>
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            No Certificates Available Yet
          </h3>
          <p className="text-xs text-[#FFF9EF]/60 max-w-md mx-auto mb-6">
            Certificates will appear here once the events you participated in are marked as completed by festival administrators.
          </p>
          <Link
            href="/dashboard/registrations"
            className="inline-block px-6 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            View My Registrations →
          </Link>
        </div>
      ) : certsWithUrls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certsWithUrls.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-6 flex flex-col justify-between hover:border-[#E5BE45] transition-all shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold tracking-wider text-[#E5BE45] uppercase">
                    {cert.certificateType} CERTIFICATE
                  </span>
                  <span className="font-mono text-[10px] text-[#FFF9EF]/50">
                    ID: {cert.certificateId}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {cert.event.name}
                </h3>

                <p className="text-xs text-[#FFF9EF]/70 mb-4">
                  Issued to: <strong className="text-white">{user.name}</strong>
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[11px] text-[#FFF9EF]/50">
                  {new Date(cert.generatedAt).toLocaleDateString()}
                </span>

                <a
                  href={cert.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-all flex items-center gap-1.5"
                >
                  <span>Download PDF</span>
                  <span>📥</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
