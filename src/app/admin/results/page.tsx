import { requireAdmin } from "@/lib/auth/permissions";
import { getAllResultsWithDetails } from "@/db/queries/results";
import { getAllEvents } from "@/db/queries/events";
import { getAllParticipants } from "@/db/queries/participants";
import { ResultRecordForm } from "./result-form";
import { ResultList } from "./result-list";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  await requireAdmin();

  const [resultsList, events, participants] = await Promise.all([
    getAllResultsWithDetails(),
    getAllEvents(),
    getAllParticipants(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
            Aaroh 2K26 • Hall of Fame
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Competition Results & Winners
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Record podium positions, points, citations, and publish winners to the public leaderboard.
          </p>
        </div>

        <ResultRecordForm
          events={events.map((e) => ({
            id: e.id,
            name: e.name,
            category: e.category,
          }))}
          participants={participants.map((p) => ({
            id: p.id,
            name: p.name,
            college: p.college,
          }))}
        />
      </div>

      <ResultList results={resultsList} />
    </div>
  );
}
