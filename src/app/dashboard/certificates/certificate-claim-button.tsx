"use client";

import { useTransition } from "react";
import { generateParticipantCertificateAction } from "@/actions/certificates";
import { ScrollText } from "lucide-react";

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
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E5BE45] hover:bg-[#D4A72C] text-black font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
    >
      <ScrollText className="w-3.5 h-3.5" />
      <span>{isPending ? "Generating PDF..." : "Claim Certificate"}</span>
    </button>
  );
}
