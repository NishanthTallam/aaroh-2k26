import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 overflow-hidden bg-[#111111]">
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero/heroimage.jpeg"
          alt="Aaroh 2K26 Cultural Festival Celebration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* Festival Darkening & Vignette Overlays for Maximum Readability */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(158,27,35,0.45)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#111111]" />
      </div>

      {/* Decorative Rotating Circles */}
      <div className="absolute top-1/2 -left-36 w-96 h-96 rounded-full border border-dashed border-[#D4A72C]/20 -translate-y-1/2 animate-[spin_60s_linear_infinite] pointer-events-none hidden md:block z-[1]" />
      <div className="absolute top-1/2 -right-36 w-96 h-96 rounded-full border border-dashed border-[#D4A72C]/20 -translate-y-1/2 animate-[spin_60s_linear_infinite] pointer-events-none hidden md:block z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Ornament */}
        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#E5BE45]" />
          <span className="text-[#E5BE45] text-lg">✦</span>
          <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#E5BE45]" />
        </div>

        {/* Small Eyebrow */}
        <div className="text-xs md:text-sm font-semibold tracking-[0.35em] text-[#E5BE45] uppercase mb-3">
          A CULTURAL CELEBRATION
        </div>

        {/* Big Aaroh Title */}
        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-bold tracking-[0.14em] text-[#FFFFFF] drop-shadow-[0_10px_40px_rgba(158,27,35,0.6)] leading-none select-none">
          AAROH
        </h1>

        {/* Year */}
        <div className="font-sans text-xl sm:text-3xl md:text-4xl font-bold tracking-[0.4em] text-[#E5BE45] mt-2 mb-6">
          2K26
        </div>

        {/* Tagline */}
        <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#FFF9EF]/90 tracking-wide max-w-2xl">
          WHERE CULTURE MEETS CELEBRATION
        </p>

        {/* Meta */}
        <p className="text-xs md:text-sm tracking-[0.25em] text-[#FFF9EF]/60 uppercase mt-4 flex items-center gap-3">
          <span>3 DAYS</span>
          <span className="text-[#D4A72C]">•</span>
          <span>CULTURE</span>
          <span className="text-[#D4A72C]">•</span>
          <span>SPORTS</span>
          <span className="text-[#D4A72C]">•</span>
          <span>CREATIVITY</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10">
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#9E1B23] text-[#FFF9EF] border border-[#E5BE45]/40 rounded text-sm font-bold tracking-[0.14em] uppercase shadow-lg shadow-[#9E1B23]/40 hover:bg-[#C62828] hover:-translate-y-1 transition-all"
          >
            Explore Events
            <span>→</span>
          </Link>

          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-[#FFF9EF] border border-[#FFF9EF]/30 rounded text-sm font-bold tracking-[0.14em] uppercase hover:border-[#E5BE45] hover:text-[#E5BE45] hover:bg-[#D4A72C]/10 hover:-translate-y-1 transition-all"
          >
            View Schedule
          </Link>
        </div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="absolute bottom-6 left-0 w-full px-6 md:px-14 flex justify-between text-xs tracking-[0.25em] text-[#FFF9EF]/40 uppercase hidden sm:flex">
        <span>EST. 2026</span>
        <span>CELEBRATE • COMPETE • CREATE</span>
        <span>PUTTPARTHI</span>
      </div>
    </section>
  );
}
