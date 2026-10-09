import { requireAdmin } from "@/lib/auth/permissions";
import { getPresignedDownloadUrl, BUCKETS } from "@/lib/storage/client";
import { PaymentQrForm } from "./payment-qr-form";
import { Calendar, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();

  let qrUrl: string | null = null;
  try {
    qrUrl = await getPresignedDownloadUrl("aroha/payment/payment-qr.png", 3600, BUCKETS.PUBLIC);
  } catch (err) {
    console.error("Failed to fetch payment QR url", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
          Aaroh 2K26 • Configuration
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Festival Settings
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Configure payment gateway details, UPI QR code, and global festival parameters.
        </p>
      </div>

      {/* QR Code Component */}
      <PaymentQrForm currentQrUrl={qrUrl} />

      {/* General Settings Card */}
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">
            Festival Global Parameters
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Operational settings for the Aaroh 2K26 national inter-college fest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Festival Name & Dates
            </span>
            <div className="text-white font-medium text-sm">
              Aaroh 2K26
            </div>
            <div className="text-white/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E5BE45]" />
              <span>OCTOBER 14 – OCTOBER 16, 2026 (3 Days)</span>
            </div>
          </div>

          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Primary Venue
            </span>
            <div className="text-white font-medium text-sm">
              Sanskrithi School of Engineering
            </div>
            <div className="text-white/60 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E5BE45] shrink-0 mt-0.5" />
              <span>Knowledge Park, Near Super Speciality Hospital, Puttaparthi, Andhra Pradesh 515134</span>
            </div>
          </div>

          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Payment UPI Information
            </span>
            <div className="text-white font-mono font-medium">
              VPA: tallamnishnath
            </div>
            <div className="text-white/60">
              Account Name: Tallam Nishanth
            </div>
          </div>

          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Storage Infrastructure
            </span>
            <div className="text-white font-medium">
              Neon Object Storage (S3-Compatible)
            </div>
            <div className="text-white/60">
              Presigned download security with path-style addressing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
