import { db } from "@/db";
import { events, schedules } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";


export default async function SchedulePage() {
  const allSchedules = await db
    .select({
      schedule: schedules,
      event: events,
    })
    .from(schedules)
    .innerJoin(events, eq(schedules.eventId, events.id))
    .orderBy(asc(schedules.startTime));

  return (
    <div className="pt-32 pb-24 px-6 md:px-14 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
          THE FESTIVAL TIMELINE
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-white mb-4">
          AAROH <span className="text-[#E5BE45] italic">SCHEDULE</span>
        </h1>
        <p className="text-[#FFF9EF]/70 text-base md:text-lg max-w-xl mx-auto">
          Three days of non-stop culture, competition, and celebration.
        </p>
      </div>

      {allSchedules.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1512] rounded border border-white/10">
          <p className="text-[#FFF9EF]/70">Schedule will be announced shortly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allSchedules.map(({ schedule, event }) => {
            const dateStr = new Date(schedule.startTime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const startTimeStr = new Date(schedule.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endTimeStr = new Date(schedule.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={schedule.id}
                className="bg-[#1A1512] border border-[#D4A72C]/20 rounded p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#E5BE45] transition-all shadow-lg"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center min-w-[90px] p-3 bg-[#111111] rounded border border-white/10">
                    <span className="text-xs font-bold tracking-wider text-[#E5BE45] uppercase block">
                      {dateStr}
                    </span>
                    <strong className="text-sm text-white font-semibold">
                      {startTimeStr}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-[0.18em] text-[#E5BE45] uppercase block mb-1">
                      {event.category.replace("_", " ")}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      {event.name}
                    </h3>
                    <div className="text-xs text-[#FFF9EF]/60 flex items-center gap-4">
                      <span>📍 {schedule.venue}</span>
                      <span>⏱️ {startTimeStr} – {endTimeStr}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/events/${event.slug}`}
                  className="px-5 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-colors self-end sm:self-center"
                >
                  View Event →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
