import { notFound } from "next/navigation";
import { getRegistrationForVerification } from "@/db/queries/registrations";
import Link from "next/link";

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyRegistrationPage({ params }: VerifyPageProps) {
  const { id } = await params;
  const registration = await getRegistrationForVerification(id);

  if (!registration) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-lg mx-auto text-center">
        <div className="bg-[#1A1512] border border-red-500/30 rounded-lg p-10 shadow-2xl">
          <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✕
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            Invalid Registration QR
          </h1>
          <p className="text-sm text-[#FFF9EF]/70 mb-6">
            This QR code could not be verified against the official Aroha 2K26 database.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = registration.status === "APPROVED";

  return (
    <div className="pt-36 pb-24 px-6 max-w-xl mx-auto">
      <div className="bg-[#1A1512] border border-[#D4A72C]/40 rounded-lg p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Verification Status Header */}
        <div className="text-center pb-8 border-b border-white/10">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ${
              isApproved
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                : "bg-amber-950 text-amber-400 border border-amber-500/40"
            }`}
          >
            {isApproved ? "✓" : "⏳"}
          </div>

          <span className="text-[11px] font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-1">
            OFFICIAL REGISTRATION VERIFICATION
          </span>

          <h1 className="font-serif text-3xl font-bold text-white mb-2">
            {isApproved ? "Verified Pass" : `Status: ${registration.status}`}
          </h1>

          <div className="text-xs font-mono text-[#FFF9EF]/60">
            ID: {registration.id}
          </div>
        </div>

        {/* Details Grid (No UTR or private payment info) */}
        <div className="py-6 space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">Event:</span>
            <strong className="text-white text-right font-medium">
              {registration.eventName}
            </strong>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">Category:</span>
            <span className="text-[#E5BE45] font-semibold">
              {registration.eventCategory.replace("_", " ")}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">Participant / Team:</span>
            <strong className="text-white">
              {registration.teamName || registration.participantName}
            </strong>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">College:</span>
            <span className="text-[#FFF9EF]/90">
              {registration.college || "N/A"}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">Registration Type:</span>
            <span className="text-white uppercase font-medium">
              {registration.registrationType}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-[#FFF9EF]/60">Venue:</span>
            <span className="text-white">{registration.venue}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-[#FFF9EF]/60">Attendance:</span>
            <span
              className={`font-bold ${
                registration.attended ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {registration.attended ? "Checked In" : "Not Checked In Yet"}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center">
          <Link
            href="/"
            className="inline-block text-xs font-bold tracking-wider text-[#E5BE45] uppercase hover:underline"
          >
            ← Back to Aaroh 2K26 Home
          </Link>
        </div>
      </div>
    </div>
  );
}
