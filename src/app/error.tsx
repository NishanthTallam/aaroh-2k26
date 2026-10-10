"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-[#1A1512] border border-[#D4A72C]/30 rounded-xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#9E1B23]/25 to-transparent pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-[#9E1B23]/20 border border-[#9E1B23]/50 flex items-center justify-center text-[#E5BE45] mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-[#E5BE45]" />
        </div>

        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-2">
          AAROH 2K26
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
          Unexpected Glitch
        </h1>
        <p className="text-sm text-[#FFF9EF]/70 mb-8 leading-relaxed">
          An unexpected celebration hiccup occurred. Don&apos;t worry, you can retry loading the page or return to the main festival grounds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#9E1B23] text-white text-xs font-bold uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] text-[#E5BE45] text-xs font-bold uppercase tracking-wider rounded border border-[#D4A72C]/40 hover:bg-white hover:text-black transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}