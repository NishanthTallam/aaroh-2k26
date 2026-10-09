import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function CulturalShowcase() {
  return (
    <section className="bg-[#111111] py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
            THE HEART OF AAROH
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] text-[#FFF9EF]">
            ROOTED IN <span className="text-[#E5BE45] italic">CULTURE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dandiya Card */}
          <article className="group relative min-h-[520px] md:h-[560px] rounded-2xl border border-[#D4A72C]/30 overflow-hidden p-8 md:p-10 flex flex-col justify-between hover:border-[#E5BE45] hover:-translate-y-2 transition-all duration-400 shadow-2xl">
            {/* Background Image & Non-intrusive Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <Image
                src="/images/dandiya/Dandiya1.jpg"
                alt="Aaroh Dandiya Festival Celebration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 font-serif text-3xl font-bold text-[#E5BE45] drop-shadow">
              01
            </div>

            <div className="relative z-10">
              <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-2 drop-shadow">
                RHYTHM • MOVEMENT • ENERGY
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold tracking-wide text-white mb-3 drop-shadow-md">
                DANDIYA
              </h3>
              <p className="text-[#FFF9EF]/90 text-base max-w-md drop-shadow">
                Where every beat brings thousands together under festive lights in rhythmic celebration.
              </p>
            </div>

            <Link
              href="/events?category=CULTURAL"
              className="relative z-10 w-12 h-12 rounded-full border border-[#E5BE45] text-[#E5BE45] inline-flex items-center justify-center text-xl self-end group-hover:bg-[#E5BE45] group-hover:text-[#111111] transition-all"
              aria-label="Explore Dandiya Events"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </article>

          {/* Bathukamma Card */}
          <article className="group relative min-h-[520px] md:h-[560px] rounded-2xl border border-[#D4A72C]/30 overflow-hidden p-8 md:p-10 flex flex-col justify-between hover:border-[#E5BE45] hover:-translate-y-2 transition-all duration-400 shadow-2xl">
            {/* Background Image & Non-intrusive Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <Image
                src="/images/bathukamma/bathukamma.jpeg"
                alt="Aaroh Bathukamma Floral Festival Celebration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 font-serif text-3xl font-bold text-[#E5BE45] drop-shadow">
              02
            </div>

            <div className="relative z-10">
              <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-2 drop-shadow">
                FLOWERS • TRADITION • TOGETHERNESS
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold tracking-wide text-white mb-3 drop-shadow-md">
                BATHUKAMMA
              </h3>
              <p className="text-[#FFF9EF]/90 text-base max-w-md drop-shadow">
                A rich Telangana celebration of concentric floral geometry, harmony, and timeless community heritage.
              </p>
            </div>

            <Link
              href="/events?category=CULTURAL"
              className="relative z-10 w-12 h-12 rounded-full border border-[#E5BE45] text-[#E5BE45] inline-flex items-center justify-center text-xl self-end group-hover:bg-[#E5BE45] group-hover:text-[#111111] transition-all"
              aria-label="Explore Bathukamma Events"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
