import { requireAdmin } from "@/lib/auth/permissions";
import { getAllParticipantsWithStats } from "@/db/queries/participants";
import { ParticipantsTable } from "./participants-table";

export const dynamic = "force-dynamic";

export default async function AdminParticipantsPage() {
  await requireAdmin();

  const participants = await getAllParticipantsWithStats();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E5BE45]">
          Aaroh 2K26 • Directory
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Participant Directory
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Review all registered student participants across participating colleges.
        </p>
      </div>

      <ParticipantsTable participants={participants} />
    </div>
  );
}
