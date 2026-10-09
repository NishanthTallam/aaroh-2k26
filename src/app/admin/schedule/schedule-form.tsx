"use client";

import { useState, useTransition } from "react";
import { createScheduleAction } from "@/actions/schedules";

type EventOption = {
  id: string;
  name: string;
  category: string;
};

export function ScheduleCreateForm({ events }: { events: EventOption[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createScheduleAction(formData);
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
        + Add Schedule Slot
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Add Schedule Round / Slot
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Publish round timeline slots to the public festival program.
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
                  Select Event *
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Round / Activity Name *
                </label>
                <input
                  type="text"
                  name="roundName"
                  required
                  placeholder="e.g., Preliminary Round / Finals / Inauguration"
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  placeholder="e.g., Main Auditorium / Open Air Theatre"
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    required
                    defaultValue="2026-03-26T10:00"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    required
                    defaultValue="2026-03-26T13:00"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
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
                  {isPending ? "Adding Slot..." : "Add Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
