import { getCompletedEventsWithResults } from "@/db/queries/events";
import Link from "next/link";


export default async function ResultsPage() {
  const completedEvents = await getCompletedEventsWithResults();

  const medals = ["🥇 1st Place", "🥈 2nd Place", "🥉 3rd Place"];

  return (
    <div className="pt-32 pb-24 px-6 md:px-14 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
          CHAMPIONS OF AAROH
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-white mb-4">
          EVENT <span className="text-[#E5BE45] italic">RESULTS</span>
        </h1>
        <p className="text-[#FFF9EF]/70 text-base md:text-lg max-w-xl mx-auto">
          Celebrating the excellence, skill, and glory of our top festival performers.
        </p>
      </div>

      {completedEvents.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1512] rounded border border-white/10 p-8">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="font-serif text-2xl font-bold text-white mb-2">
            Competitions in Progress
          </h3>
          <p className="text-sm text-[#FFF9EF]/70 max-w-md mx-auto mb-6">
            Official event results and winner announcements will be posted here as each event concludes.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-2.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            Explore Active Events →
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {completedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-[#1A1512] border border-[#D4A72C]/30 rounded p-8 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
                    {event.category.replace("_", " ")}
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white">
                    {event.name}
                  </h2>
                </div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold px-3 py-1 rounded">
                  COMPLETED
                </span>
              </div>

              {event.results.length === 0 ? (
                <p className="text-xs text-[#FFF9EF]/60 italic">
                  Results verification in progress.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {event.results.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 bg-[#111111] rounded border border-white/5 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold tracking-wider text-[#E5BE45] uppercase block mb-2">
                        {medals[res.position - 1] || `Rank ${res.position}`}
                      </span>
                      <strong className="text-white text-lg font-serif block mb-1">
                        {res.participantName || "Team"}
                      </strong>
                      <span className="text-xs text-[#FFF9EF]/60 block">
                        {res.college || "Participant"}
                      </span>
                      {res.score && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-[#E5BE45] font-semibold">
                          Score: {res.score}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
