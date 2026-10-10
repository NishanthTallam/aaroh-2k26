import { notFound } from "next/navigation";
import { getRegistrationById } from "@/db/queries/registrations";
import { requireAuth } from "@/lib/auth/permissions";
import { getFileViewUrl } from "@/lib/storage/certificates";
import Link from "next/link";
import QRCode from "qrcode";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface RegistrationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RegistrationDetailPage({
  params,
}: RegistrationDetailPageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const data = await getRegistrationById(id);

  if (!data) {
    notFound();
  }

  // Ensure user owns this registration or is Admin/Manager
  if (
    data.participantId !== user.id &&
    user.role !== "ADMIN" &&
    user.role !== "EVENT_MANAGER"
  ) {
    notFound();
  }

  const isApproved = data.status === "APPROVED";
  const isPending = data.status === "PENDING";

  // Only generate QR data URL when approved by organizer
  let qrDataUrl: string | null = null;
  if (isApproved) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify/${data.id}`;
    qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 2,
      width: 280,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    });
  }

  // Get presigned URL for payment screenshot from Neon Object Storage
  let paymentScreenshotUrl: string | null = null;
  if (data.paymentScreenshotPath) {
    try {
      paymentScreenshotUrl = await getFileViewUrl(data.paymentScreenshotPath);
    } catch {
      paymentScreenshotUrl = null;
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard/registrations"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white transition-colors"
      >
        ← Back to all registrations
      </Link>

      {/* Festival Event Pass Card */}
      <div className="bg-[#1A1512] border-2 border-[#D4A72C]/40 rounded-xl overflow-hidden shadow-2xl">
        {/* Pass Top Banner */}
        <div
          className={`p-6 text-center border-b ${
            isApproved
              ? "bg-gradient-to-r from-[#6E1018] via-[#9E1B23] to-[#6E1018] border-[#D4A72C]/30"
              : isPending
              ? "bg-gradient-to-r from-[#2A200B] via-[#4A3814] to-[#2A200B] border-[#D4A72C]/30"
              : "bg-gradient-to-r from-[#300A0E] via-[#521319] to-[#300A0E] border-red-800/40"
          }`}
        >
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#E5BE45] uppercase block mb-1">
            {isApproved
              ? "OFFICIAL FESTIVAL PASS"
              : isPending
              ? "REGISTRATION SUBMITTED • UNDER REVIEW"
              : "REGISTRATION REJECTED"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wider">
            AAROH 2K26
          </h1>
          <span className="text-xs text-[#FFF9EF]/80 tracking-widest uppercase">
            {data.event.category.replace("_", " ")}
          </span>
        </div>

        {/* Pending Review Announcement Banner */}
        {isPending && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-3.5 text-center flex items-center justify-center gap-2 text-xs text-amber-300">
            <Clock className="w-4 h-4 text-[#E5BE45] shrink-0" />
            <span className="font-medium">
              Your registration is under review by the organizer. The QR pass will be available once approved.
            </span>
          </div>
        )}

        {/* Pass Body */}
        <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* QR Code Presentation Box OR Under Review Box */}
          {isApproved && qrDataUrl ? (
            <div className="flex flex-col items-center bg-white p-6 rounded-xl text-black text-center shadow-xl border-2 border-emerald-500/40">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Entry Pass</span>
              </div>
              <img
                src={qrDataUrl}
                alt={`QR Code for Registration ${data.id}`}
                className="w-48 h-48 rounded"
              />
              <span className="font-mono text-[10px] text-neutral-600 font-bold mt-2 truncate max-w-[200px]">
                {data.id}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                Scan at Venue Entrance
              </span>
            </div>
          ) : isPending ? (
            <div className="flex flex-col items-center justify-center bg-[#130E0B] border-2 border-dashed border-[#D4A72C]/40 p-6 rounded-xl text-center shadow-lg min-h-[280px]">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-[#E5BE45]/40 flex items-center justify-center text-[#E5BE45] mb-4">
                <Clock className="w-7 h-7 text-[#E5BE45]" />
              </div>
              <span className="inline-block px-3 py-1 bg-amber-950/80 text-amber-300 border border-amber-600/50 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                Under Review
              </span>
              <p className="text-xs font-semibold text-white mb-2 leading-relaxed">
                Your registration is under review by the organizer. The QR pass will be available once approved.
              </p>
              <p className="text-[11px] text-[#FFF9EF]/55 leading-normal mt-1">
                UTR: <span className="text-[#E5BE45] font-mono">{data.utrNumber}</span> is being verified. Once approved, your entry QR will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-[#1B0F10] border-2 border-red-900/50 p-6 rounded-xl text-center shadow-lg min-h-[280px]">
              <div className="w-14 h-14 rounded-full bg-red-950 border border-red-700/50 flex items-center justify-center text-red-400 mb-4">
                <XCircle className="w-7 h-7 text-red-400" />
              </div>
              <span className="inline-block px-3 py-1 bg-red-950 text-red-400 border border-red-700 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                Registration Rejected
              </span>
              <p className="text-xs text-white/80 mt-1">
                {data.rejectionReason || "This registration was not approved. Please contact event coordinators."}
              </p>
            </div>
          )}

          {/* Registration Details */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#E5BE45] uppercase block mb-1">
                Event
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">
                {data.event.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  Registration Type
                </span>
                <strong className="text-white text-sm">
                  {data.registrationType}
                  {data.teamName && ` (${data.teamName})`}
                </strong>
              </div>

              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  Status
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mt-1 ${
                    data.status === "APPROVED"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                      : data.status === "REJECTED"
                      ? "bg-red-950 text-red-400 border border-red-700"
                      : "bg-amber-950 text-amber-400 border border-amber-700"
                  }`}
                >
                  {data.status}
                </span>
              </div>

              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  Participant / Captain
                </span>
                <strong className="text-white text-sm">{data.participant.name}</strong>
              </div>

              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  College
                </span>
                <span className="text-[#FFF9EF]/90">
                  {data.participant.college || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  Venue & Timing
                </span>
                <span className="text-white">
                  {data.event.venue} • {new Date(data.event.eventDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-[#FFF9EF]/50 uppercase tracking-wider block">
                  Fee Paid (UTR)
                </span>
                <span className="text-[#E5BE45] font-semibold">
                  ₹{data.fee} ({data.utrNumber})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Roster if Team */}
        {data.registrationType === "TEAM" && data.members && data.members.length > 0 && (
          <div className="p-8 border-t border-white/10 bg-[#111111]">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-4">
              Team Roster ({data.members.length + 1} Members)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#1A1512] rounded border border-white/5">
                <strong className="text-white block">{data.participant.name} (Captain)</strong>
                <span className="text-[#FFF9EF]/60">{data.participant.rollNumber}</span>
              </div>
              {data.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-[#1A1512] rounded border border-white/5"
                >
                  <strong className="text-white block">{member.name}</strong>
                  <span className="text-[#FFF9EF]/60">
                    {member.rollNumber} • {member.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Verification Proof Section */}
        {paymentScreenshotUrl && (
          <div className="p-8 border-t border-white/10 bg-[#111111]/60">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-3">
              Payment Verification Receipt
            </h3>
            <div className="flex items-center gap-4">
              <a
                href={paymentScreenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1512] text-xs text-[#E5BE45] border border-[#D4A72C]/30 rounded hover:bg-[#E5BE45] hover:text-black transition-all"
              >
                <span>📸 View Uploaded Screenshot</span>
                <span>↗</span>
              </a>
              <span className="text-xs text-[#FFF9EF]/50">
                Uploaded file is fully secured.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
