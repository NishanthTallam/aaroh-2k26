import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/aroha/hero";
import { FestivalCountdown } from "@/components/aroha/festival-countdown";
import { CulturalShowcase } from "@/components/aroha/cultural-showcase";
import { Coordinates } from "@/components/aroha/coordinates";
import { FAQ } from "@/components/aroha/faq";
import { FinalCta } from "@/components/aroha/final-cta";
import { getPublishedEvents } from "@/db/queries/events";

export default async function HomePage() {
  const publishedEvents = await getPublishedEvents();

  const categories = [
    {
      number: "01",
      name: "CULTURALS",
      sub: "DANCE • MUSIC • DRAMA",
      slug: "CULTURAL",
      bgClass: "from-[#871921] to-[#300609]",
    },
    {
      number: "02",
      name: "SPORTS",
      sub: "TEAM SPIRIT • FITNESS • GLORY",
      slug: "SPORTS",
      bgClass: "from-[#1b4d3e] to-[#071f18]",
    },
    {
      number: "03",
      name: "CREATIVE MEDIA",
      sub: "DESIGN • FILM • PHOTOGRAPHY",
      slug: "CREATIVE_MEDIA",
      bgClass: "from-[#6c2e74] to-[#200a24]",
    },
    {
      number: "04",
      name: "FOOD FEST",
      sub: "STREET FOOD • FLAVOUR • MORE",
      slug: "FOOD_FEST",
      bgClass: "from-[#b86214] to-[#3a1b02]",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <div id="home">
        <Hero />
      </div>

      {/* 2. Live Countdown */}
      <FestivalCountdown />

      {/* 3. About Section (Warm White Editorial Theme) */}
      <section id="about" className="bg-[#FFF9EF] text-[#111111] py-28 px-6 md:px-14 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-5xl text-[#9E1B23]/15 select-none hidden md:block">
          ✿
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#9E1B23] uppercase block mb-3">
                ABOUT AAROH
              </span>
              <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
                MORE <br />
                THAN A <br />
                <span className="text-[#9E1B23] italic">FEST</span>
              </h2>
              <p className="text-[#4a3e36] text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Aaroh 2K26 brings together culture, competition, creativity, and community
                across three unforgettable days of celebration on campus.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.12em] uppercase text-[#9E1B23] border-b-2 border-[#9E1B23] pb-1 hover:text-[#6E1018] hover:gap-3 transition-all"
              >
                Discover Aaroh <span>→</span>
              </Link>
            </div>

            {/* Editorial Visual Card with Official Poster */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md h-[520px] md:h-[580px] rounded-xl overflow-hidden shadow-2xl border-2 border-[#D4A72C]/40 group bg-[#111111]">
                <Image
                  src="/images/general/aaroh2k26.jpeg"
                  alt="Aaroh 2K26 Official Festival Poster - Sanskrithi Group of Institutions"
                  fill
                  priority
                  className="object-contain sm:object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#E5BE45] uppercase">
                    AAROH 2K26 OFFICIAL POSTER
                  </span>
                  <p className="text-white text-xs mt-1">
                    Sanskrithi School of Engineering • Puttaparthi
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full max-w-md h-[520px] md:h-[580px] border-2 border-[#D4A72C] rounded-xl -z-10 hidden sm:block" />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 mt-16 border-t border-[#9E1B23]/15 text-center">
            <div>
              <strong className="font-serif text-5xl md:text-6xl text-[#9E1B23] font-bold block leading-none">
                3
              </strong>
              <span className="text-xs tracking-[0.2em] font-semibold text-[#6d5b50] uppercase mt-2 block">
                DAYS
              </span>
            </div>
            <div>
              <strong className="font-serif text-5xl md:text-6xl text-[#9E1B23] font-bold block leading-none">
                4
              </strong>
              <span className="text-xs tracking-[0.2em] font-semibold text-[#6d5b50] uppercase mt-2 block">
                WORLDS
              </span>
            </div>
            <div>
              <strong className="font-serif text-5xl md:text-6xl text-[#9E1B23] font-bold block leading-none">
                20+
              </strong>
              <span className="text-xs tracking-[0.2em] font-semibold text-[#6d5b50] uppercase mt-2 block">
                EVENTS
              </span>
            </div>
            <div>
              <strong className="font-serif text-5xl md:text-6xl text-[#9E1B23] font-bold block leading-none">
                1
              </strong>
              <span className="text-xs tracking-[0.2em] font-semibold text-[#6d5b50] uppercase mt-2 block">
                FESTIVAL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cultural Showcase (Dandiya + Bathukamma) */}
      <CulturalShowcase />

      {/* 5. Four Worlds Categories */}
      <section id="events" className="bg-[#FFF9EF] text-[#111111] py-28 px-6 md:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#9E1B23] uppercase block mb-3">
                THE FESTIVAL HAS MANY FACES
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                FOUR WORLDS. <br />
                <span className="text-[#9E1B23]">COUNTLESS MOMENTS.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#111111] text-[#FFF9EF] border border-[#D4A72C] rounded text-xs font-bold tracking-[0.14em] uppercase hover:bg-[#9E1B23] hover:border-transparent transition-all self-start md:self-auto"
            >
              View All Events <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.number}
                href={`/events?category=${cat.slug}`}
                className="group relative h-[420px] rounded overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-400 block"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.bgClass} group-hover:scale-105 transition-transform duration-700`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-[#FFF9EF] z-10">
                  <span className="font-serif text-2xl font-bold text-[#E5BE45]">
                    {cat.number}
                  </span>
                  <div>
                    <span className="text-[11px] tracking-[0.2em] text-[#FFF9EF]/70 uppercase block mb-1">
                      {cat.sub}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-xl text-[#E5BE45] self-end group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Events from Live Neon DB */}
      <section className="bg-[#111111] py-28 px-6 md:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
                WHAT&apos;S HAPPENING
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#FFF9EF]">
                DON&apos;T MISS <span className="text-[#E5BE45]">THE MOMENTS.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] border-b border-[#D4A72C] pb-1 hover:text-white hover:border-white transition-all self-start md:self-auto"
            >
              Explore All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedEvents.slice(0, 6).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group relative h-[380px] rounded border border-white/10 overflow-hidden bg-[#1A1512] hover:border-[#E5BE45] hover:-translate-y-2 transition-all duration-400 flex flex-col justify-end p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
                    {event.category.replace("_", " ")}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-[#E5BE45] transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-xs tracking-wider text-[#FFF9EF]/60 mb-4">
                    {event.venue} • {event.registrationType} REGISTRATION
                  </p>
                  <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#E5BE45] inline-flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    Explore Event →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Three-Day Schedule Section */}
      <section id="schedule" className="bg-[#FFF9EF] text-[#111111] py-28 px-6 md:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-[#9E1B23] uppercase block mb-3">
              THREE DAYS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4">
              ONE UNFORGETTABLE <br />
              <span className="text-[#9E1B23]">FEST.</span>
            </h2>
            <p className="text-[#55483f] text-base leading-relaxed mb-8">
              From morning competitions to starlit cultural nights, every hour brings
              something to cheer, create, and remember.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111111] text-[#FFF9EF] rounded text-xs font-bold tracking-[0.14em] uppercase border border-[#D4A72C] hover:bg-[#9E1B23] transition-all"
            >
              View Full Schedule →
            </Link>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Day 1 */}
            <div className="bg-white border border-[#9E1B23]/15 rounded p-6 shadow-sm hover:border-[#9E1B23] hover:-translate-y-1 transition-all">
              <span className="font-serif text-2xl font-bold text-[#9E1B23] block">
                DAY 01
              </span>
              <span className="text-[10px] tracking-wider font-bold text-[#7b695d] uppercase block mb-6">
                CULTURE & TRADITION
              </span>
              <div className="space-y-4 text-xs">
                <div>
                  <time className="font-bold text-[#9E1B23] block">10:00 AM</time>
                  <span className="font-medium text-[#111111]">Opening Ceremony</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">11:30 AM</time>
                  <span className="font-medium text-[#111111]">Sur Sangam (Singing)</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">05:30 PM</time>
                  <span className="font-medium text-[#111111]">Dandiya Night & Garba</span>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white border border-[#9E1B23]/15 rounded p-6 shadow-sm hover:border-[#9E1B23] hover:-translate-y-1 transition-all">
              <span className="font-serif text-2xl font-bold text-[#9E1B23] block">
                DAY 02
              </span>
              <span className="text-[10px] tracking-wider font-bold text-[#7b695d] uppercase block mb-6">
                CREATIVITY & SPORTS
              </span>
              <div className="space-y-4 text-xs">
                <div>
                  <time className="font-bold text-[#9E1B23] block">09:00 AM</time>
                  <span className="font-medium text-[#111111]">Rann-Bhoomi (Cricket)</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">10:00 AM</time>
                  <span className="font-medium text-[#111111]">Drishti Photography</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">05:00 PM</time>
                  <span className="font-medium text-[#111111]">Nritya Tarang (Choreo)</span>
                </div>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-white border border-[#9E1B23]/15 rounded p-6 shadow-sm hover:border-[#9E1B23] hover:-translate-y-1 transition-all">
              <span className="font-serif text-2xl font-bold text-[#9E1B23] block">
                DAY 03
              </span>
              <span className="text-[10px] tracking-wider font-bold text-[#7b695d] uppercase block mb-6">
                FINALE & CELEBRATION
              </span>
              <div className="space-y-4 text-xs">
                <div>
                  <time className="font-bold text-[#9E1B23] block">12:00 PM</time>
                  <span className="font-medium text-[#111111]">Zaiqa Master Chef</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">04:00 PM</time>
                  <span className="font-medium text-[#111111]">Grand Finale & Awards</span>
                </div>
                <div>
                  <time className="font-bold text-[#9E1B23] block">07:30 PM</time>
                  <span className="font-medium text-[#111111]">Celebrity DJ Night</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Coordinates & FAQ */}
      <section id="coordinates" className="bg-[#111111] py-28 px-6 md:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Coordinates />
          <div id="faq">
            <FAQ />
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <FinalCta />
    </div>
  );
}
