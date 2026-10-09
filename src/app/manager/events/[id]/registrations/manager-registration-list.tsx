"use client";

import { useState, useTransition } from "react";
import {
  approveRegistrationAction,
  rejectRegistrationAction,
  checkInParticipantAction,
} from "@/actions/registrations";

type MemberItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rollNumber: string | null;
  department?: string | null;
  year?: string | null;
  college?: string | null;
};

type RegistrationItem = {
  id: string;
  registrationType: string;
  teamName: string | null;
  fee: number;
  utrNumber: string | null;
  paymentScreenshotPath: string | null;
  paymentScreenshotUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  attended: boolean;
  rejectionReason: string | null;
  createdAt: Date;
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    rollNumber: string | null;
    college: string | null;
    department: string | null;
  };
  members: MemberItem[];
};

export function ManagerRegistrationList({
  registrations,
  eventName,
}: {
  registrations: RegistrationItem[];
  eventName: string;
}) {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filtered = registrations.filter((r) => {
    const matchesFilter = filter === "ALL" || r.status === filter;
    const query = search.toLowerCase();
    const matchesSearch =
      r.participant.name.toLowerCase().includes(query) ||
      r.participant.email.toLowerCase().includes(query) ||
      (r.participant.phone && r.participant.phone.includes(query)) ||
      (r.participant.rollNumber && r.participant.rollNumber.toLowerCase().includes(query)) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(query)) ||
      (r.teamName && r.teamName.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id: string) => {
    startTransition(async () => {
      try {
        await approveRegistrationAction(id);
        setActionNotice("Entry approved successfully! QR pass has been activated.");
        setTimeout(() => setActionNotice(null), 3500);
      } catch {
        setActionNotice("Error: Could not approve registration.");
      }
    });
  };

  const handleConfirmReject = () => {
    if (!rejectModalId) return;
    const id = rejectModalId;
    startTransition(async () => {
      try {
        await rejectRegistrationAction(id, rejectReason || undefined);
        setRejectModalId(null);
        setRejectReason("");
        setActionNotice("Registration rejected.");
        setTimeout(() => setActionNotice(null), 3500);
      } catch {
        setActionNotice("Error: Could not reject registration.");
      }
    });
  };

  const handleCheckIn = (id: string) => {
    startTransition(async () => {
      try {
        await checkInParticipantAction(id);
        setActionNotice("Attendance marked! Participant checked in at venue.");
        setTimeout(() => setActionNotice(null), 3500);
      } catch {
        setActionNotice("Error: Could not mark check-in.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 animate-in fade-in">
          {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, roll number, team, UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1F1813] border border-[#D4A72C]/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4A72C]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === st
                  ? "bg-[#8B1D1D] text-white border border-[#D4A72C]/50"
                  : "bg-[#171310] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {st} (
              {st === "ALL"
                ? registrations.length
                : registrations.filter((r) => r.status === st).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-12 text-center text-white/50">
            No registrations match your search criteria.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-5 hover:border-[#D4A72C]/40 transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#E5BE45] font-bold">
                      {r.id.substring(0, 8)}...
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {r.registrationType === "TEAM"
                        ? `Team: ${r.teamName || "Untitled Team"}`
                        : "Solo Entry"}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40">
                    Registered on{" "}
                    {new Date(r.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      r.status === "APPROVED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : r.status === "REJECTED"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>

                  {r.attended && (
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      🎟️ Attended
                    </span>
                  )}
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Participant Details */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#E5BE45] tracking-wider block">
                    Participant Details
                  </span>
                  <div className="text-white font-semibold">
                    {r.participant.name}
                  </div>
                  <div className="text-white/60">{r.participant.email}</div>
                  <div className="text-white/60">
                    📞 {r.participant.phone || "No phone provided"}
                  </div>
                  <div className="text-white/60">
                    🎓 {r.participant.college || "N/A"}{" "}
                    {r.participant.rollNumber ? `(${r.participant.rollNumber})` : ""}
                  </div>
                </div>

                {/* Payment & Audit */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#E5BE45] tracking-wider block">
                    Fee & Transaction
                  </span>
                  <div className="text-white">
                    Fee:{" "}
                    <strong className="text-[#E5BE45]">
                      {r.fee > 0 ? `₹${r.fee}` : "Free"}
                    </strong>
                  </div>
                  <div className="font-mono text-white/80">
                    UTR:{" "}
                    <span className="bg-[#111111] px-2 py-0.5 rounded text-white font-bold">
                      {r.utrNumber || "N/A"}
                    </span>
                  </div>

                  {r.paymentScreenshotUrl ? (
                    <button
                      type="button"
                      onClick={() => setScreenshotModal(r.paymentScreenshotUrl)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#1F1813] hover:bg-[#2A211B] text-[#E5BE45] border border-[#D4A72C]/40 rounded text-xs font-bold transition-all"
                    >
                      <span>📸 View Payment Proof</span>
                      <span>🔍</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-white/40 italic block mt-1">
                      No screenshot uploaded
                    </span>
                  )}
                </div>

                {/* Team members if any */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#E5BE45] tracking-wider block mb-1">
                    Team Roster ({r.members.length + 1})
                  </span>
                  {r.registrationType === "TEAM" && r.members.length > 0 ? (
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      <div className="text-white font-medium">
                        • {r.participant.name} (Lead)
                      </div>
                      {r.members.map((m) => (
                        <div key={m.id} className="text-white/60 text-[11px]">
                          • {m.name} {m.rollNumber ? `(${m.rollNumber})` : ""}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-white/50 text-[11px]">
                      Solo entry (No additional members)
                    </span>
                  )}
                </div>
              </div>

              {r.rejectionReason && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-300">
                  <strong>Rejection Note:</strong> {r.rejectionReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={isPending || r.status === "APPROVED"}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all disabled:opacity-40"
                  >
                    ✓ Approve Entry
                  </button>

                  <button
                    onClick={() => {
                      setRejectModalId(r.id);
                      setRejectReason("");
                    }}
                    disabled={isPending || r.status === "REJECTED"}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all disabled:opacity-40"
                  >
                    ✕ Reject Entry
                  </button>
                </div>

                {r.status === "APPROVED" && (
                  <button
                    onClick={() => handleCheckIn(r.id)}
                    disabled={isPending || r.attended}
                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                      r.attended
                        ? "bg-blue-900/40 text-blue-300 border border-blue-500/30 cursor-not-allowed"
                        : "bg-[#1F1813] hover:bg-[#2A211B] text-[#E5BE45] border border-[#D4A72C]/40"
                    }`}
                  >
                    {r.attended ? "✓ Attended at Venue" : "🎟️ Mark Venue Attendance"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Screenshot Zoom Modal */}
      {screenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Payment Verification Proof
                </h4>
                <p className="text-xs text-white/50">
                  Uploaded by participant to Neon Object Storage
                </p>
              </div>
              <button
                onClick={() => setScreenshotModal(null)}
                className="text-white/60 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-black rounded-lg border border-white/10 p-2 flex items-center justify-center min-h-[350px] max-h-[500px] overflow-hidden">
              <img
                src={screenshotModal}
                alt="Payment proof screenshot full view"
                className="max-h-[480px] w-auto object-contain rounded"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <a
                href={screenshotModal}
                target="_blank"
                rel="noreferrer"
                className="text-[#E5BE45] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Open in full resolution new tab</span>
                <span>↗</span>
              </a>
              <button
                onClick={() => setScreenshotModal(null)}
                className="px-4 py-1.5 bg-[#8B1D1D] text-white rounded font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-red-500/40 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h4 className="font-serif text-lg font-bold text-white">
                Reject Registration
              </h4>
              <button
                onClick={() => setRejectModalId(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70">
              Please provide an explanation for rejecting this entry (visible to the participant).
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UTR transaction number invalid, amount incorrect, or blurry screenshot."
                className="w-full bg-[#111111] border border-red-500/30 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded text-xs font-semibold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {isPending ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
