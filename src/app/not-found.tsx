import Link from "next/link";
import { Compass, Home, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-28">
      <div className="max-w-lg w-full bg-[#1A1512] border-2 border-[#D4A72C]/40 rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-radial from-[#E5BE45]/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-radial from-[#9E1B23]/20 to-transparent pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-[#111111] border border-[#D4A72C]/40 flex items-center justify-center text-[#E5BE45] mx-auto mb-6 shadow-inner">
          <Compass className="w-10 h-10 text-[#E5BE45] animate-pulse" />
        </div>

        <span className="text-xs font-bold tracking-[0.3em] text-[#E5BE45] uppercase block mb-2">
          PAGE NOT FOUND • 404
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
          Lost in the Fest?
        </h1>
        <p className="text-sm text-[#FFF9EF]/70 mb-8 max-w-md mx-auto leading-relaxed">
          The stage or moment you are looking for has moved or does not exist. Explore our lineup of events or return to the main festival grounds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Festival Home</span>
          </Link>
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111111] text-[#E5BE45] text-xs font-bold uppercase tracking-wider rounded border border-[#D4A72C]/40 hover:bg-white hover:text-black transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Explore Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
