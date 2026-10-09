import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative bg-[radial-gradient(circle_at_center,#631218_0%,#170305_100%)] border-y border-[#D4A72C]/30 py-32 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(17,17,17,0.6)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase mb-4">
          THE FESTIVAL AWAITS
        </span>

        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-4">
          READY TO MAKE <br />
          <span className="text-[#E5BE45] italic">AAROH YOURS?</span>
        </h2>

        <p className="text-[#FFF9EF]/85 text-lg md:text-xl mb-10 max-w-lg">
          Three days. Hundreds of moments. One unforgettable festival celebration.
        </p>

        <Link
          href="/events"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#E5BE45] text-[#111111] font-bold text-sm tracking-[0.14em] uppercase rounded shadow-2xl shadow-[#E5BE45]/30 hover:bg-[#D4A72C] hover:-translate-y-1 transition-all"
        >
          Explore Events
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
