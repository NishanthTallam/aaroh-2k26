import { requireManager } from "@/lib/auth/permissions";
import {
  getSchedulesByManagerWithEvent,
  getAllSchedulesWithEvent,
} from "@/db/queries/schedules";
import { getEventsByManager, getAllEvents } from "@/db/queries/events";
import { ScheduleCreateForm } from "@/app/admin/schedule/schedule-form";
import { ScheduleList } from "@/app/admin/schedule/schedule-list";

export const dynamic = "force-dynamic";

export default async function ManagerSchedulePage() {
  const user = await requireManager();

  const [schedules, events] = await Promise.all([
    user.role === "ADMIN"
      ? getAllSchedulesWithEvent()
      : getSchedulesByManagerWithEvent(user.id),
    user.role === "ADMIN"
      ? getAllEvents()
      : getEventsByManager(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
            Aaroh 2K26 • Timeline
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Competition Schedule & Slots
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Define rounds, stage venues, and timing slots for your assigned events.
          </p>
        </div>

        <ScheduleCreateForm
          events={events.map((e) => ({
            id: e.id,
            name: e.name,
            category: e.category,
          }))}
        />
      </div>

      <ScheduleList schedules={schedules} />
    </div>
  );
}
