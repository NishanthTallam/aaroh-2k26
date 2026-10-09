"use client";

import { useState } from "react";
import {
  approveRegistrationAction,
  rejectRegistrationAction,
  checkInParticipantAction,
} from "@/actions/registrations";

interface ReviewControlsProps {
  registrationId: string;
  status: string;
}

export function RegistrationReviewControls({
  registrationId,
  status,
}: ReviewControlsProps) {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await approveRegistrationAction(registrationId);
      setMessage("✓ Registration approved successfully!");
    } catch {
      setMessage("Failed to approve registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await rejectRegistrationAction(registrationId, rejectReason || undefined);
      setMessage("Registration marked as rejected.");
      setShowRejectBox(false);
    } catch {
      setMessage("Failed to reject registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await checkInParticipantAction(registrationId);
      setMessage("✓ Participant checked in at venue!");
    } catch {
      setMessage("Failed to check in participant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 bg-neutral-900 border border-white/20 rounded text-xs text-white">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading || status === "APPROVED"}
          onClick={handleApprove}
          className="flex-1 py-3 px-4 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-emerald-600 transition-all disabled:opacity-40"
        >
          {loading ? "Processing..." : "✓ Approve Entry"}
        </button>

        <button
          type="button"
          disabled={loading || status === "REJECTED"}
          onClick={() => setShowRejectBox(!showRejectBox)}
          className="flex-1 py-3 px-4 bg-red-900 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-red-800 transition-all disabled:opacity-40"
        >
          ✕ Reject Entry
        </button>
      </div>

      {showRejectBox && (
        <div className="p-4 bg-black/60 rounded border border-red-500/30 space-y-3">
          <label className="text-xs text-red-200 block">
            Reason for Rejection (Optional):
          </label>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. UTR number mismatch or blurry payment screenshot"
            className="w-full px-3 py-2 bg-[#111111] border border-red-500/30 rounded text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleReject}
            className="w-full py-2 bg-red-700 text-white text-xs font-bold uppercase rounded hover:bg-red-600"
          >
            Confirm Rejection
          </button>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="pt-3 border-t border-white/10">
          <button
            type="button"
            disabled={loading}
            onClick={handleCheckIn}
            className="w-full py-2.5 bg-[#111111] text-[#E5BE45] border border-[#D4A72C]/40 font-bold text-xs uppercase tracking-wider rounded hover:bg-[#E5BE45] hover:text-black transition-all"
          >
            🎟️ Check In at Venue (Attendance)
          </button>
        </div>
      )}
    </div>
  );
}
