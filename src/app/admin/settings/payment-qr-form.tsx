"use client";

import { useActionState, useState } from "react";
import { uploadPaymentQrAction } from "@/actions/settings";
import Image from "next/image";

export function PaymentQrForm({ currentQrUrl }: { currentQrUrl: string | null }) {
  const [state, formAction, isPending] = useActionState(uploadPaymentQrAction, null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="font-serif text-lg font-bold text-white">
          Festival Payment UPI QR Code
        </h3>
        <p className="text-xs text-white/60 mt-0.5">
          This QR code is presented to all participants during event checkout for fee payments.
          Stored directly in Neon Object Storage.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-200">
          Payment QR Code uploaded and published to S3 storage successfully!
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#111111] rounded-xl border border-white/10">
        <div className="w-44 h-44 bg-white rounded-lg p-2 flex items-center justify-center shrink-0 border border-white/20 overflow-hidden relative">
          {preview ? (
            <img
              src={preview}
              alt="New QR Preview"
              className="w-full h-full object-contain"
            />
          ) : currentQrUrl ? (
            <img
              src={currentQrUrl}
              alt="Current UPI QR"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-2 text-black">
              <span className="text-2xl block mb-1">📱</span>
              <span className="text-[10px] font-bold uppercase tracking-wider block text-black/60">
                Default QR
              </span>
              <span className="text-[11px] font-mono font-bold">
                aroha2k26@upi
              </span>
            </div>
          )}
        </div>

        <form action={formAction} className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
              Upload New QR Image (PNG, JPG, WebP)
            </label>
            <input
              type="file"
              name="paymentQr"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              required
              className="w-full text-xs text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-[#D4A72C]/40 file:text-xs file:font-bold file:bg-[#8B1D1D] file:text-white hover:file:bg-[#A32222] file:cursor-pointer"
            />
          </div>

          <p className="text-[11px] text-white/50">
            Recommended size: 500x500 square image with high contrast for easy scanner reading.
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#8B1D1D] hover:bg-[#A32222] text-white border border-[#D4A72C]/40 disabled:opacity-50 transition-all"
          >
            {isPending ? "Uploading to Neon Storage..." : "Upload & Update QR"}
          </button>
        </form>
      </div>
    </div>
  );
}
