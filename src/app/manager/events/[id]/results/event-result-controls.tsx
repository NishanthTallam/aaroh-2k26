"use client";

import { useState, useTransition } from "react";
import { recordResultAction, deleteResultAction } from "@/actions/results";

type ResultItem = {
  id: string;
  position: number;
  score: string | null;
  remarks: string | null;
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

type ParticipantOption = {
  id: string;
  name: string;
  college: string | null;
  registrationId: string;
  teamName: string | null;
};

export function EventResultControls({
  eventId,
  results,
  participants,
}: {
  eventId: string;
  results: ResultItem[];
  participants: ParticipantOption[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("eventId", eventId);

    // If an approved participant registration is chosen, get both participantId and registrationId
    const selectedCombined = formData.get("entrySelect") as string;
    if (selectedCombined) {
      const [pId, rId] = selectedCombined.split("::");
      formData.append("participantId", pId);
      if (rId) formData.append("registrationId", rId);
    }

    startTransition(async () => {
      const res = await recordResultAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
        form.reset();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this result?")) {
      startTransition(async () => {
        await deleteResultAction(id, eventId);
      });
    }
  };

  const getPositionBadge = (pos: number) => {
    if (pos === 1)
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          🥇 1st Place (Winner)
        </span>
      );
    if (pos === 2)
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-300/20 text-slate-200 border border-slate-400/40">
          🥈 2nd Place (Runner-up)
        </span>
      );
    if (pos === 3)
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-700/20 text-amber-500 border border-amber-700/40">
          🥉 3rd Place (2nd Runner-up)
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-white/10 text-white/80">
        Rank {pos}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-xl font-bold text-white">
          Event Leaderboard & Podium
        </h3>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2.5 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4A72C]/40 shadow-sm transition-all"
        >
          + Declare Winner
        </button>
      </div>

      {/* Results List */}
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl overflow-hidden">
        {results.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            No results declared yet for this event. Click "+ Declare Winner" to publish positions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111111] border-b border-[#D4A72C]/20 text-[#E5BE45] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Position</th>
                  <th className="px-5 py-3.5">Winner / Team</th>
                  <th className="px-5 py-3.5">Score / Points</th>
                  <th className="px-5 py-3.5">Remarks / Citation</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
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
                    <td className="px-5 py-4 text-white/70 italic max-w-sm truncate">
                      {r.remarks || "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
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
        )}
      </div>

      {/* Record Result Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Declare Winner Position
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Declare podium placements for approved participants.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Position *
                  </label>
                  <select
                    name="position"
                    required
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  >
                    <option value="1">🥇 1st Place (Winner)</option>
                    <option value="2">🥈 2nd Place (Runner-up)</option>
                    <option value="3">🥉 3rd Place (2nd Runner-up)</option>
                    <option value="4">Consolation / Special Mention</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Score / Scorecard
                  </label>
                  <input
                    type="text"
                    name="score"
                    placeholder="e.g. 98.5 / 100"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Participant / Team *
                </label>
                <select
                  name="entrySelect"
                  required
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                >
                  <option value="">— Select Participant or Team —</option>
                  {participants.map((p) => (
                    <option
                      key={p.registrationId}
                      value={`${p.id}::${p.registrationId}`}
                    >
                      {p.teamName ? `[Team: ${p.teamName}] ` : ""}
                      {p.name} {p.college ? `(${p.college})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Remarks / Citation
                </label>
                <textarea
                  name="remarks"
                  rows={2}
                  placeholder="e.g. Exemplary technical precision and synchronization."
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#8B1D1D] hover:bg-[#A32222] text-white border border-[#D4A72C]/40 disabled:opacity-50"
                >
                  {isPending ? "Declaring..." : "Publish Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
