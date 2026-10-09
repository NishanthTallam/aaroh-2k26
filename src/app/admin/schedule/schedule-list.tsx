"use client";

import { useTransition } from "react";
import { deleteScheduleAction } from "@/actions/schedules";

type ScheduleItem = {
  id: string;
  roundName: string | null;
  venue: string;
  startTime: Date;
  endTime: Date;
  event: {
    id: string;
    name: string;
    category: string;
  };
};

export function ScheduleList({ schedules }: { schedules: ScheduleItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule slot?")) {
      startTransition(async () => {
        await deleteScheduleAction(id);
      });
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-12 text-center text-white/50">
        No schedule slots created yet. Click "+ Add Schedule Slot" above to publish timelines.
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
              <th className="px-5 py-3.5">Round / Activity</th>
              <th className="px-5 py-3.5">Venue</th>
              <th className="px-5 py-3.5">Start Time</th>
              <th className="px-5 py-3.5">End Time</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <strong className="block text-white font-medium">
                    {s.event.name}
                  </strong>
                  <span className="text-[10px] text-[#E5BE45] font-semibold uppercase">
                    {s.event.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/90 font-medium">
                  {s.roundName || "General Round"}
                </td>
                <td className="px-5 py-4 text-white/70">
                  📍 {s.venue}
                </td>
                <td className="px-5 py-4 text-white/80">
                  {new Date(s.startTime).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-5 py-4 text-white/80">
                  {new Date(s.endTime).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleDelete(s.id)}
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
