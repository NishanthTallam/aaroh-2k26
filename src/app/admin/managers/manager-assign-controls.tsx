"use client";

import { useState, useTransition } from "react";
import { assignEventManagerAction } from "@/actions/managers";

type EventItem = {
  id: string;
  name: string;
  category: string;
  eventManagerId: string | null;
};

type ManagerOption = {
  id: string;
  name: string;
  email: string;
};

export function ManagerAssignControls({
  events,
  managers,
}: {
  events: EventItem[];
  managers: ManagerOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || "");
  const [selectedManager, setSelectedManager] = useState<string>("unassigned");
  const [statusMessage, setStatusMessage] = useState("");

  const handleAssign = () => {
    if (!selectedEvent) return;

    startTransition(async () => {
      const managerId = selectedManager === "unassigned" ? null : selectedManager;
      const res = await assignEventManagerAction(selectedEvent, managerId);
      if (res.success) {
        setStatusMessage("Event assignment updated successfully!");
        setTimeout(() => setStatusMessage(""), 3000);
      }
    });
  };

  return (
    <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl p-6 space-y-4">
      <div>
        <h3 className="font-serif text-lg font-bold text-white">
          Assign Lead Manager to Event
        </h3>
        <p className="text-xs text-white/60">
          Selected manager gains full operational control over the event's registrations, schedule, and results.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-200">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              const ev = events.find((item) => item.id === e.target.value);
              setSelectedManager(ev?.eventManagerId || "unassigned");
            }}
            className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({ev.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
            Assign Lead Manager
          </label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
          >
            <option value="unassigned">— None (Unassigned) —</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={handleAssign}
            disabled={isPending || !selectedEvent}
            className="w-full px-4 py-2.5 bg-[#D4A72C] hover:bg-[#E5BE45] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
