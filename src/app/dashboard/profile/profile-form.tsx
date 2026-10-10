"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/auth";
import type { Profile } from "@/db/schema";

interface ProfileFormProps {
  user: Profile;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 bg-red-950/70 border border-red-500/50 rounded text-xs text-red-200">
          ⚠️ {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded text-xs text-emerald-200">
          ✓ Profile updated successfully!
        </div>
      )}

      <div>
        <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          disabled
          value={user.email}
          className="w-full px-4 py-2.5 bg-[#111111]/60 border border-white/10 rounded text-sm text-neutral-400 cursor-not-allowed"
        />
        <span className="text-[10px] text-[#FFF9EF]/40 mt-1 block">
          Email cannot be changed as it is linked to your festival registrations.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={user.name}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            defaultValue={user.phone || ""}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            College / Institution *
          </label>
          <select
            name="college"
            required
            defaultValue={user.college || "Sanskrithi School of Engineering"}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="Sanskrithi School of Engineering">Sanskrithi School of Engineering</option>
            <option value="Sanskrithi School of Business">Sanskrithi School of Business</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Roll / Student ID *
          </label>
          <input
            type="text"
            name="rollNumber"
            required
            defaultValue={user.rollNumber || ""}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Department *
          </label>
          <select
            name="department"
            required
            defaultValue={user.department || "CSE"}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
            <option value="AI/ML">AI/ML</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Year of Study *
          </label>
          <select
            name="year"
            defaultValue={user.year || "3rd Year"}
            className="w-full px-4 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      <div className="p-3.5 bg-[#111111]/90 border border-[#E5BE45]/30 rounded-lg text-xs text-[#FFF9EF]/80">
        <strong className="text-[#E5BE45] font-semibold block mb-0.5">
          Important Notice for Certification:
        </strong>
        Please ensure all details are accurate. These are used directly to print your official festival participation and merit certificates.
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all disabled:opacity-50"
      >
        {isPending ? "Saving Profile..." : "Save Changes"}
      </button>
    </form>
  );
}
