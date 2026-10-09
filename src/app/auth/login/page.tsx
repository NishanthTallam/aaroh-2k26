"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { ArohaLogo } from "@/components/aroha/aroha-logo";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#350c11_0%,#111111_75%)]">
      <div className="w-full max-w-md bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Ornament */}
        <div className="text-center mb-8">
          <ArohaLogo size="sm" className="justify-center mb-3" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-1">
            PARTICIPANT & ORGANIZER PORTAL
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">Sign In</h1>
        </div>

        {state?.error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 rounded text-xs text-red-200">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@college.edu"
              className="w-full px-4 py-3 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase">
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/40 shadow-lg shadow-[#9E1B23]/30 hover:bg-[#C62828] transition-all disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In to Aroha →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-[#FFF9EF]/60">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/register"
            className="text-[#E5BE45] font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[11px] text-[#FFF9EF]/40 hover:text-[#FFF9EF] transition-colors"
          >
            ← Back to festival home
          </Link>
        </div>
      </div>
    </div>
  );
}
