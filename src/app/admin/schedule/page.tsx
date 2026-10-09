import { requireAdmin } from "@/lib/auth/permissions";
import { getAllSchedulesWithEvent } from "@/db/queries/schedules";
import { getAllEvents } from "@/db/queries/events";
import { ScheduleCreateForm } from "./schedule-form";
import { ScheduleList } from "./schedule-list";

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  await requireAdmin();

  const [schedules, events] = await Promise.all([
    getAllSchedulesWithEvent(),
    getAllEvents(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
            Aaroh 2K26 • Timeline
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Festival Schedule Management
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Program round slots, venues, and timings for the 3-day festival.
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
