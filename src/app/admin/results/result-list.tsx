"use client";

import { useTransition } from "react";
import { deleteResultAction } from "@/actions/results";
import { Trophy, Medal, Award } from "lucide-react";

type ResultItem = {
  id: string;
  position: number;
  score: string | null;
  remarks: string | null;
  event: {
    id: string;
    name: string;
    category: string;
  };
  participant: {
    id: string;
    name: string;
    college: string | null;
  } | null;
  registration: {
    id: string;
    teamName: string | null;
  } | null;
};

export function ResultList({ results }: { results: ResultItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, eventId: string) => {
    if (confirm("Delete this winner entry?")) {
      startTransition(async () => {
        await deleteResultAction(id, eventId);
      });
    }
  };

  const getPositionBadge = (pos: number) => {
    if (pos === 1)
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Trophy className="w-3.5 h-3.5" />
          <span>1st Place</span>
        </span>
      );
    if (pos === 2)
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-300/20 text-slate-200 border border-slate-400/40">
          <Medal className="w-3.5 h-3.5" />
          <span>2nd Place</span>
        </span>
      );
    if (pos === 3)
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-700/20 text-amber-500 border border-amber-700/40">
          <Award className="w-3.5 h-3.5" />
          <span>3rd Place</span>
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-white/80">
        Rank {pos}
      </span>
    );
  };

  if (results.length === 0) {
    return (
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-12 text-center text-white/50">
        No results recorded yet. Click "+ Record Winner Result" above once events finish judging.
      </div>
    );
  }

  return (
    <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#D4A72C]/20 text-[#E5BE45] uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Event</th>
              <th className="px-5 py-3.5">Rank / Position</th>
              <th className="px-5 py-3.5">Winner / Team</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5">Remarks</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <strong className="block text-white font-medium">
                    {r.event.name}
                  </strong>
                  <span className="text-[10px] text-[#E5BE45] font-semibold uppercase">
                    {r.event.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {getPositionBadge(r.position)}
                </td>
                <td className="px-5 py-4 text-white">
                  <div className="font-semibold text-white">
                    {r.participant?.name || r.registration?.teamName || "Anonymous Participant"}
                  </div>
                  {r.participant?.college && (
                    <div className="text-[11px] text-white/50">
                      {r.participant.college}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-white/80">
                  {r.score || "—"}
                </td>
                <td className="px-5 py-4 text-white/70 italic max-w-xs truncate">
                  {r.remarks || "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id, r.event.id)}
                    disabled={isPending}
                    className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[11px] disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
