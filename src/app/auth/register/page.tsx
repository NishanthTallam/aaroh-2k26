"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { ArohaLogo } from "@/components/aroha/aroha-logo";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#350c11_0%,#111111_75%)]">
      <div className="w-full max-w-lg bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <ArohaLogo size="sm" className="justify-center mb-3" />
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-1">
            FESTIVAL REGISTRATION
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">
            Create Participant Account
          </h1>
        </div>

        {state?.error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 rounded text-xs text-red-200">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ananya Sharma"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="ananya@college.edu"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                College / University
              </label>
              <input
                type="text"
                name="college"
                placeholder="ABC Institute of Tech"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                placeholder="22CSE042"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Department
              </label>
              <input
                type="text"
                name="department"
                placeholder="Computer Science"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5BE45]"
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
                Year of Study
              </label>
              <select
                name="year"
                defaultValue="3rd Year"
                className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-4 py-3.5 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/40 shadow-lg shadow-[#9E1B23]/30 hover:bg-[#C62828] transition-all disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Register Account →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-[#FFF9EF]/60">
          Already registered?{" "}
          <Link href="/auth/login" className="text-[#E5BE45] font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
