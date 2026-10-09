"use client";

import { useTransition } from "react";
import { generateParticipantCertificateAction } from "@/actions/certificates";

export function CertificateClaimButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClaim = () => {
    startTransition(async () => {
      await generateParticipantCertificateAction(eventId);
    });
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isPending}
      className="px-4 py-2 bg-[#E5BE45] hover:bg-[#D4A72C] text-black font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
    >
      {isPending ? "Generating PDF..." : "Claim Certificate 📜"}
    </button>
  );
}
