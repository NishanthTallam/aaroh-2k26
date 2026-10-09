import { requireAdmin } from "@/lib/auth/permissions";
import { getPresignedDownloadUrl, BUCKETS } from "@/lib/storage/client";
import { PaymentQrForm } from "./payment-qr-form";

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
              Aaroh 2K26 (National Inter-College Cultural & Sports Fest)
            </div>
            <div className="text-white/60">
              📅 March 26 – March 28, 2026 (3 Days)
            </div>
          </div>

          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Primary Venue
            </span>
            <div className="text-white font-medium text-sm">
              Aroha University Main Campus
            </div>
            <div className="text-white/60">
              📍 Knowledge Park, Gandipet Road, Hyderabad, Telangana 500075
            </div>
          </div>

          <div className="p-4 bg-[#111111] rounded-lg border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5BE45]">
              Payment UPI Information
            </span>
            <div className="text-white font-mono font-medium">
              VPA: aroha2k26@upi
            </div>
            <div className="text-white/60">
              Account Name: Aroha 2K26 Cultural Fest Committee
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
