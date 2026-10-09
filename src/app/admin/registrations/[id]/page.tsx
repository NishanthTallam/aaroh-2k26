import { notFound } from "next/navigation";
import { getRegistrationById } from "@/db/queries/registrations";
import { getFileViewUrl } from "@/lib/storage/certificates";
import { RegistrationReviewControls } from "./review-controls";
import Link from "next/link";
import QRCode from "qrcode";

interface AdminReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRegistrationReviewPage({
  params,
}: AdminReviewPageProps) {
  const { id } = await params;
  const data = await getRegistrationById(id);

  if (!data) {
    notFound();
  }

  // Get presigned URL for the uploaded payment screenshot from Neon Object Storage
  let paymentScreenshotUrl: string | null = null;
  if (data.paymentScreenshotPath) {
    try {
      paymentScreenshotUrl = await getFileViewUrl(data.paymentScreenshotPath);
    } catch {
      paymentScreenshotUrl = null;
    }
  }

  // QR preview
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/verify/${data.id}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 1,
    width: 200,
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link
        href="/admin/registrations"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        ← Back to all registrations
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
            PAYMENT AUDIT & ENTRY VERIFICATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Registration Review: {data.id}
          </h1>
        </div>

        <span
          className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
            data.status === "APPROVED"
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : data.status === "REJECTED"
              ? "bg-red-950 text-red-400 border border-red-800"
              : "bg-amber-950 text-amber-400 border border-amber-800"
          }`}
        >
          {data.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Participant & Event Information */}
        <div className="space-y-6">
          <div className="bg-[#171310] border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase pb-3 border-b border-white/10">
              Entry Information
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Event:</span>
                <strong className="text-white text-right">{data.event.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Category:</span>
                <span className="text-[#E5BE45] font-semibold">
                  {data.event.category.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Registration Type:</span>
                <span className="text-white uppercase font-medium">
                  {data.registrationType}
                  {data.teamName && ` (${data.teamName})`}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Required Fee:</span>
                <span className="text-[#E5BE45] font-bold">₹{data.fee}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Reported UTR:</span>
                <span className="font-mono text-white text-xs font-bold bg-[#111111] px-2 py-0.5 rounded">
                  {data.utrNumber}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#FFF9EF]/60">Registration Time:</span>
                <span className="text-white">
                  {new Date(data.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#171310] border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase pb-3 border-b border-white/10">
              Participant Identification
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Name:</span>
                <strong className="text-white">{data.participant.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Email:</span>
                <span className="text-white">{data.participant.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Phone:</span>
                <span className="text-white">{data.participant.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#FFF9EF]/60">Roll Number:</span>
                <span className="text-white">{data.participant.rollNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#FFF9EF]/60">College:</span>
                <span className="text-white">{data.participant.college || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Team Members Roster */}
          {data.registrationType === "TEAM" && data.members && data.members.length > 0 && (
            <div className="bg-[#171310] border border-white/10 rounded-lg p-6 space-y-3">
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase pb-2 border-b border-white/10">
                Team Members ({data.members.length + 1})
              </h2>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#111111] rounded">
                  <strong className="text-white block">{data.participant.name} (Captain)</strong>
                  <span className="text-[#FFF9EF]/60">{data.participant.email}</span>
                </div>
                {data.members.map((m) => (
                  <div key={m.id} className="p-2.5 bg-[#111111] rounded">
                    <strong className="text-white block">{m.name}</strong>
                    <span className="text-[#FFF9EF]/60">
                      {m.rollNumber} • {m.email} • {m.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment Screenshot Audit Viewer & Decision Controls */}
        <div className="space-y-6">
          {/* Payment Screenshot Card */}
          <div className="bg-[#171310] border-2 border-[#D4A72C]/30 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase">
                📸 Payment Screenshot (Proof)
              </span>
              <span className="text-[10px] text-[#FFF9EF]/50 uppercase font-mono">
                S3 Secure Storage
              </span>
            </div>

            {paymentScreenshotUrl ? (
              <div className="space-y-3">
                <div className="relative bg-black rounded border border-white/10 overflow-hidden flex items-center justify-center p-2 min-h-[300px]">
                  <img
                    src={paymentScreenshotUrl}
                    alt="Participant payment proof screenshot"
                    className="max-h-[380px] w-auto object-contain rounded"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <a
                    href={paymentScreenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#E5BE45] hover:underline font-bold"
                  >
                    <span>Open Full Image in New Tab</span>
                    <span>↗</span>
                  </a>
                  <span className="text-[#FFF9EF]/50 text-[10px]">
                    Verify UTR against bank statement
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-500 text-xs bg-black rounded">
                No payment screenshot uploaded or image unavailable.
              </div>
            )}
          </div>

          {/* Decision Approve / Reject Controls */}
          <div className="bg-[#171310] border border-white/10 rounded-lg p-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-4">
              Audit Decision & Verification
            </h3>
            <RegistrationReviewControls registrationId={data.id} status={data.status} />
          </div>

          {/* Generated QR Pass Preview */}
          <div className="bg-[#171310] border border-white/10 rounded-lg p-6 flex items-center gap-6">
            <img src={qrDataUrl} alt="Pass QR" className="w-24 h-24 rounded bg-white p-1" />
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#E5BE45] uppercase block mb-1">
                Generated Pass QR
              </span>
              <p className="text-xs text-[#FFF9EF]/70 mb-2">
                This QR pass is unlocked in the participant&apos;s dashboard.
              </p>
              <Link
                href={`/verify/${data.id}`}
                target="_blank"
                className="text-xs text-[#E5BE45] hover:underline font-semibold"
              >
                Test Scanner URL →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
