import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug } from "@/db/queries/events";
import { getSession } from "@/lib/auth/session";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const session = await getSession();

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const regOpen = new Date(event.registrationOpen) <= new Date();
  const regClosed = new Date(event.registrationClose) < new Date();
  const canRegister = regOpen && !regClosed && event.status === "PUBLISHED";

  return (
    <div className="pt-32 pb-24 px-6 md:px-14 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white mb-8 transition-colors"
      >
        ← Back to all events
      </Link>

      {/* Header */}
      <div className="bg-[#1A1512] border border-[#D4A72C]/30 rounded p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#9E1B23]/30 to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase">
            {event.category.replace("_", " ")}
          </span>
          <span className="text-[#D4A72C]">•</span>
          <span className="text-xs font-bold tracking-[0.15em] text-[#FFF9EF]/70 uppercase">
            {event.registrationType} REGISTRATION
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          {event.name}
        </h1>

        <p className="text-[#FFF9EF]/80 text-lg leading-relaxed max-w-3xl mb-8">
          {event.description}
        </p>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-[#FFF9EF]/50 uppercase tracking-wider block mb-1">
              Date
            </span>
            <strong className="text-white text-sm font-semibold">{formattedDate}</strong>
          </div>
          <div>
            <span className="text-[#FFF9EF]/50 uppercase tracking-wider block mb-1">
              Venue
            </span>
            <strong className="text-white text-sm font-semibold">{event.venue}</strong>
          </div>
          <div>
            <span className="text-[#FFF9EF]/50 uppercase tracking-wider block mb-1">
              Registration Fee
            </span>
            <strong className="text-[#E5BE45] text-sm font-semibold">
              {event.registrationType === "SOLO"
                ? `₹${event.soloFee} (Solo)`
                : event.registrationType === "TEAM"
                ? `₹${event.teamFee} (Team)`
                : `₹${event.soloFee} / ₹${event.teamFee}`}
            </strong>
          </div>
          <div>
            <span className="text-[#FFF9EF]/50 uppercase tracking-wider block mb-1">
              Team Size
            </span>
            <strong className="text-white text-sm font-semibold">
              {event.minTeamSize === event.maxTeamSize
                ? `${event.minTeamSize} Member(s)`
                : `${event.minTeamSize} - ${event.maxTeamSize} Members`}
            </strong>
          </div>
        </div>
      </div>

      {/* Rules & Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Rules */}
          {event.rules && (
            <div className="bg-[#1A1512] border border-white/10 rounded p-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#E5BE45]">📜</span> Event Rules & Guidelines
              </h2>
              <div className="text-sm text-[#FFF9EF]/80 leading-relaxed whitespace-pre-line space-y-2">
                {event.rules}
              </div>
            </div>
          )}

          {/* Schedule Rounds */}
          {event.schedules && event.schedules.length > 0 && (
            <div className="bg-[#1A1512] border border-white/10 rounded p-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#E5BE45]">⏱️</span> Schedule & Timeline
              </h2>
              <div className="space-y-4">
                {event.schedules.map((sch) => {
                  const start = new Date(sch.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const end = new Date(sch.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={sch.id}
                      className="flex items-center justify-between p-3.5 bg-[#111111] rounded border border-white/5"
                    >
                      <div>
                        <strong className="text-white text-sm block">
                          {sch.roundName || "Round"}
                        </strong>
                        <span className="text-xs text-[#FFF9EF]/60">📍 {sch.venue}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#E5BE45]">
                        {start} - {end}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Registration CTA Sidebar */}
        <div>
          <div className="bg-[#1A1512] border border-[#D4A72C]/40 rounded p-8 sticky top-28 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Join the Competition
            </h3>
            <p className="text-xs text-[#FFF9EF]/70 mb-6">
              Complete payment, submit your transaction UTR and screenshot, and secure your spot.
            </p>

            <div className="space-y-3 mb-6 p-4 bg-[#111111] rounded text-xs">
              <div className="flex justify-between">
                <span className="text-[#FFF9EF]/60">Status:</span>
                <span
                  className={`font-bold ${
                    canRegister ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {canRegister
                    ? "Registrations Open"
                    : regClosed
                    ? "Registrations Closed"
                    : "Opening Soon"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FFF9EF]/60">Closes:</span>
                <span className="text-white">
                  {new Date(event.registrationClose).toLocaleDateString()}
                </span>
              </div>
            </div>

            {canRegister ? (
              <Link
                href={
                  session
                    ? `/events/${event.slug}/register`
                    : `/auth/login?redirect=/events/${event.slug}/register`
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/40 shadow-lg shadow-[#9E1B23]/30 hover:bg-[#C62828] hover:-translate-y-0.5 transition-all text-center"
              >
                {session ? "Register Now →" : "Login to Register →"}
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3.5 bg-neutral-800 text-neutral-400 font-bold text-xs uppercase tracking-wider rounded cursor-not-allowed"
              >
                Registrations Closed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
