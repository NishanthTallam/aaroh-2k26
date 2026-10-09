import Link from "next/link";
import { getPublishedEvents } from "@/db/queries/events";


interface EventsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category } = await searchParams;
  const allEvents = await getPublishedEvents();

  const filteredEvents = category
    ? allEvents.filter((e) => e.category === category)
    : allEvents;

  const categories = [
    { label: "All Events", value: "" },
    { label: "Culturals", value: "CULTURAL" },
    { label: "Sports", value: "SPORTS" },
    { label: "Creative Media", value: "CREATIVE_MEDIA" },
    { label: "Food Fest", value: "FOOD_FEST" },
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-14 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
          THE AAROH PROGRAM
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-white mb-4">
          EXPLORE <span className="text-[#E5BE45] italic">EVENTS</span>
        </h1>
        <p className="text-[#FFF9EF]/70 text-base md:text-lg max-w-xl mx-auto">
          Every event. Every competition. Every moment. Choose your arena and make your mark.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        {categories.map((cat) => {
          const isActive = (category || "") === cat.value;
          return (
            <Link
              key={cat.label}
              href={cat.value ? `/events?category=${cat.value}` : "/events"}
              className={`px-6 py-2.5 rounded text-xs font-bold tracking-[0.12em] uppercase transition-all ${
                isActive
                  ? "bg-[#9E1B23] text-white border border-[#E5BE45]/60 shadow-lg shadow-[#9E1B23]/30"
                  : "bg-[#1A1512] text-[#FFF9EF]/80 border border-[#D4A72C]/20 hover:border-[#E5BE45] hover:text-[#E5BE45]"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1512] rounded border border-white/10">
          <p className="text-lg text-[#FFF9EF]/60">
            No events found in this category yet.
          </p>
          <Link
            href="/events"
            className="mt-4 inline-block text-xs font-bold tracking-wider text-[#E5BE45] uppercase hover:underline"
          >
            Clear filter →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const dateStr = new Date(event.eventDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={event.id}
                className="group bg-[#1A1512] border border-[#D4A72C]/20 rounded p-8 flex flex-col justify-between hover:border-[#E5BE45] hover:-translate-y-2 transition-all duration-400 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold tracking-wider mb-4">
                    <span className="text-[#E5BE45] uppercase">
                      {event.category.replace("_", " ")}
                    </span>
                    <span className="bg-[#111111] text-[#FFF9EF]/80 px-2.5 py-1 rounded border border-white/10">
                      {event.registrationType}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#E5BE45] transition-colors">
                    {event.name}
                  </h3>

                  <p className="text-[#FFF9EF]/70 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-[#FFF9EF]/60 space-y-1">
                    <div>📍 {event.venue}</div>
                    <div>🗓️ {dateStr}</div>
                  </div>

                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#C62828] transition-all"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
