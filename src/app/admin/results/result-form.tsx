"use client";

import { useState, useTransition } from "react";
import { recordResultAction } from "@/actions/results";

type EventOption = {
  id: string;
  name: string;
  category: string;
};

type ParticipantOption = {
  id: string;
  name: string;
  college: string | null;
};

export function ResultRecordForm({
  events,
  participants,
}: {
  events: EventOption[];
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

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4A72C]/40 shadow-sm transition-all"
      >
        + Record Winner Result
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Record Winner / Result
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Declare podium winners for events. Results are immediately visible on public hall of fame.
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Event *
                </label>
                <select
                  name="eventId"
                  required
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                >
                  <option value="">— Choose Event —</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.category})
                    </option>
                  ))}
                </select>
              </div>

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
                    <option value="1">1st Place (Winner)</option>
                    <option value="2">2nd Place (Runner-up)</option>
                    <option value="3">3rd Place (2nd Runner-up)</option>
                    <option value="4">Consolation / Special Mention</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Score / Points
                  </label>
                  <input
                    type="text"
                    name="score"
                    placeholder="e.g. 96.5 / 100"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Participant / Lead *
                </label>
                <select
                  name="participantId"
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                >
                  <option value="">— Select Participant —</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
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
                  placeholder="e.g. Masterful choreography and expressive stage presence"
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
                  {isPending ? "Recording..." : "Save Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
