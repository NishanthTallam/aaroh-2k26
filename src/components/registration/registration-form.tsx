"use client";

import { useState, useActionState } from "react";
import { createRegistrationAction } from "@/actions/registrations";
import type { Event, Profile } from "@/db/schema";
import Image from "next/image";
import { Camera, AlertCircle, QrCode, ExternalLink, ShieldCheck } from "lucide-react";

interface RegistrationFormProps {
  event: Event;
  user: Profile;
  paymentQrUrl?: string | null;
}

export function RegistrationForm({
  event,
  user,
  paymentQrUrl,
}: RegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(
    createRegistrationAction,
    null
  );

  const initialType =
    event.registrationType === "BOTH"
      ? "SOLO"
      : (event.registrationType as "SOLO" | "TEAM");

  const [regType, setRegType] = useState<"SOLO" | "TEAM">(initialType);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Dynamic team members state
  const [teamMembers, setTeamMembers] = useState([
    {
      name: "",
      rollNumber: "",
      email: "",
      phone: "",
      department: "",
      year: "3rd Year",
    },
  ]);

  const addMember = () => {
    if (teamMembers.length + 1 < event.maxTeamSize) {
      setTeamMembers([
        ...teamMembers,
        {
          name: "",
          rollNumber: "",
          email: "",
          phone: "",
          department: "",
          year: "3rd Year",
        },
      ]);
    }
  };

  const removeMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const calculatedFee = regType === "SOLO" ? event.soloFee : event.teamFee;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="registrationType" value={regType} />

      {state?.error && (
        <div className="p-4 bg-red-950/70 border border-red-500/50 rounded text-sm text-red-200 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Step 1: Select Type if BOTH */}
      {event.registrationType === "BOTH" && (
        <div className="bg-[#111111] border border-white/10 rounded p-6">
          <label className="text-xs font-bold tracking-wider text-[#E5BE45] uppercase block mb-3">
            Select Participation Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRegType("SOLO")}
              className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
                regType === "SOLO"
                  ? "bg-[#9E1B23] text-white border-[#E5BE45]"
                  : "bg-[#1A1512] text-[#FFF9EF]/70 border-white/10 hover:border-white/30"
              }`}
            >
              Solo Entry (₹{event.soloFee})
            </button>
            <button
              type="button"
              onClick={() => setRegType("TEAM")}
              className={`py-3 px-4 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
                regType === "TEAM"
                  ? "bg-[#9E1B23] text-white border-[#E5BE45]"
                  : "bg-[#1A1512] text-[#FFF9EF]/70 border-white/10 hover:border-white/30"
              }`}
            >
              Team Entry (₹{event.teamFee})
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment Details with Common QR */}
      <div className="bg-[#111111] border border-[#D4A72C]/30 rounded p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
              PAYMENT INFORMATION
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Registration Fee: <span className="text-[#E5BE45]">₹{calculatedFee}</span>
            </h3>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded font-semibold">
            UPI / Instant Transfer
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Payment QR Code Box */}
          <div className="lg:col-span-5 flex flex-col items-center bg-white p-6 sm:p-7 rounded-xl text-black text-center shadow-2xl border-2 border-[#D4A72C]/40">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
              <QrCode className="w-3.5 h-3.5 text-[#9E1B23]" />
              <span>Official Festival UPI QR</span>
            </div>

            {paymentQrUrl ? (
              <div className="w-64 h-64 sm:w-72 sm:h-72 bg-white border border-neutral-200 rounded-lg p-2.5 relative mb-3 flex items-center justify-center shadow-inner">
                <img
                  src={paymentQrUrl}
                  alt="Aaroh 2K26 UPI Merchant QR"
                  className="w-full h-full object-contain select-none"
                />
              </div>
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center p-6 relative mb-3">
                <div className="text-center">
                  <div className="font-bold text-xl tracking-wider text-[#9E1B23]">
                    AAROH 2K26
                  </div>
                  <div className="text-xs font-mono text-neutral-600 mt-2 bg-neutral-100 px-3 py-1 rounded border">
                    UPI ID: aroha2k26@upi
                  </div>
                  <div className="text-base font-bold text-[#111111] mt-3">
                    Amount: <span className="text-[#9E1B23]">₹{calculatedFee}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-3 font-medium">
                    Scan with GPay, PhonePe, Paytm, or BHIM
                  </div>
                </div>
              </div>
            )}

            <div className="w-full flex items-center justify-between text-[11px] font-semibold text-neutral-700 pt-2 border-t border-neutral-200">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Fee: ₹{calculatedFee}</span>
              {paymentQrUrl && (
                <a
                  href={paymentQrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#9E1B23] hover:underline font-bold text-[11px]"
                >
                  <span>Open Full QR</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Transfer • Verified Merchant</span>
            </div>
          </div>

          {/* Payment Proof Collection */}
          <div className="lg:col-span-7 space-y-5">
            {/* Payment Guide Steps */}
            <div className="p-4 bg-[#1A1512] border border-[#D4A72C]/25 rounded-lg space-y-2 text-xs">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
                How to Complete Payment
              </span>
              <div className="flex items-start gap-2.5 text-[#FFF9EF]/80">
                <span className="w-5 h-5 rounded-full bg-[#E5BE45]/20 text-[#E5BE45] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Scan the QR code on the left using <strong>Google Pay, PhonePe, Paytm, or BHIM</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#FFF9EF]/80">
                <span className="w-5 h-5 rounded-full bg-[#E5BE45]/20 text-[#E5BE45] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Transfer exact registration fee: <strong className="text-[#E5BE45]">₹{calculatedFee}</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#FFF9EF]/80">
                <span className="w-5 h-5 rounded-full bg-[#E5BE45]/20 text-[#E5BE45] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Enter the <strong>12-digit Bank UTR / Reference ID</strong> and upload the payment receipt below.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF] uppercase block mb-1.5">
                Bank UTR / Transaction Reference Number *
              </label>
              <input
                type="text"
                name="utrNumber"
                required
                placeholder="e.g. 408573928172 (12-digit reference)"
                className="w-full px-4 py-3 bg-[#1A1512] border border-[#D4A72C]/30 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
              />
              <span className="text-[11px] text-[#FFF9EF]/50 mt-1 block">
                Found on your payment receipt after transferring ₹{calculatedFee}.
              </span>
            </div>

            {/* NEW REQUIREMENT: Payment Screenshot Upload */}
            <div>
              <label className="text-xs font-bold tracking-wider text-[#E5BE45] uppercase block mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Payment Screenshot *</span>
              </label>
              <input
                type="file"
                name="paymentScreenshot"
                required
                accept="image/jpeg,image/png,image/webp"
                onChange={handleScreenshotChange}
                className="w-full text-xs text-[#FFF9EF]/70 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#9E1B23] file:text-white hover:file:bg-[#C62828] cursor-pointer"
              />
              <span className="text-[11px] text-[#FFF9EF]/50 mt-1 block">
                PNG, JPG or WebP (Max 5 MB). Must clearly show the UTR and amount.
              </span>

              {previewUrl && (
                <div className="mt-3 p-2 bg-[#1A1512] rounded border border-white/10 inline-block">
                  <span className="text-[10px] text-[#E5BE45] font-bold uppercase block mb-1">
                    Receipt Preview:
                  </span>
                  <img
                    src={previewUrl}
                    alt="Payment receipt preview"
                    className="max-h-36 max-w-xs object-contain rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Registration Info */}
      <div className="bg-[#111111] border border-white/10 rounded p-6 sm:p-8 space-y-6">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block">
          PARTICIPANT INFORMATION
        </span>

        {regType === "SOLO" ? (
          <div className="p-4 bg-[#1A1512] rounded border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#FFF9EF]/60">Participant Name:</span>
              <strong className="text-white">{user.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#FFF9EF]/60">Email:</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#FFF9EF]/60">College:</span>
              <span className="text-white">{user.college || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#FFF9EF]/60">Roll Number:</span>
              <span className="text-white">{user.rollNumber || "N/A"}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF] uppercase block mb-1.5">
                Team Name *
              </label>
              <input
                type="text"
                name="teamName"
                required
                placeholder="e.g. Thunder Strikers"
                className="w-full px-4 py-3 bg-[#1A1512] border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
              />
            </div>

            <input type="hidden" name="memberCount" value={teamMembers.length} />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  Team Members (Captain: {user.name})
                </span>
                {teamMembers.length + 1 < event.maxTeamSize && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="text-xs font-bold text-[#E5BE45] hover:underline"
                  >
                    + Add Member
                  </button>
                )}
              </div>

              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#1A1512] rounded border border-white/10 space-y-3 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#E5BE45]">
                      Member #{index + 2}
                    </span>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name={`member_${index}_name`}
                      required
                      placeholder="Member Full Name"
                      className="px-3 py-2 bg-[#111111] border border-white/10 rounded text-xs text-white"
                    />
                    <input
                      type="text"
                      name={`member_${index}_rollNumber`}
                      required
                      placeholder="Roll Number"
                      className="px-3 py-2 bg-[#111111] border border-white/10 rounded text-xs text-white"
                    />
                    <input
                      type="email"
                      name={`member_${index}_email`}
                      required
                      placeholder="Email Address"
                      className="px-3 py-2 bg-[#111111] border border-white/10 rounded text-xs text-white"
                    />
                    <input
                      type="tel"
                      name={`member_${index}_phone`}
                      required
                      placeholder="Phone Number"
                      className="px-3 py-2 bg-[#111111] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/40 shadow-xl shadow-[#9E1B23]/40 hover:bg-[#C62828] transition-all disabled:opacity-50"
      >
        {isPending
          ? "Uploading Screenshot & Generating QR Pass..."
          : `Confirm Registration (₹${calculatedFee}) →`}
      </button>
    </form>
  );
}
