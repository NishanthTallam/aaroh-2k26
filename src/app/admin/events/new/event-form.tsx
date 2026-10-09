"use client";

import { useActionState } from "react";
import { createEventAction } from "@/actions/events";
import type { Profile } from "@/db/schema";

interface EventCreateFormProps {
  managers: Profile[];
}

export function EventCreateForm({ managers }: EventCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createEventAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3 bg-red-950/70 border border-red-500/50 rounded text-xs text-red-200">
          ⚠️ {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Event Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Nritya Tarang"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Category *
          </label>
          <select
            name="category"
            required
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="CULTURAL">Culturals (Dance / Music / Drama)</option>
            <option value="SPORTS">Sports (Cricket / Futsal / Athletics)</option>
            <option value="CREATIVE_MEDIA">Creative Media (Film / Design / Photo)</option>
            <option value="FOOD_FEST">Food Fest (Culinary / Mocktails)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Brief overview and exciting premise of the competition..."
          className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
        />
      </div>

      <div>
        <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
          Event Rules & Guidelines
        </label>
        <textarea
          name="rules"
          rows={4}
          placeholder="Numbered rules, time limits, scoring criteria..."
          className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Venue *
          </label>
          <input
            type="text"
            name="venue"
            required
            placeholder="e.g. Main Amphitheatre"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Registration Type *
          </label>
          <select
            name="registrationType"
            required
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="SOLO">Solo Only</option>
            <option value="TEAM">Team Only</option>
            <option value="BOTH">Both (Solo & Team Allowed)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Solo Fee (₹)
          </label>
          <input
            type="number"
            name="soloFee"
            defaultValue={0}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Team Fee (₹)
          </label>
          <input
            type="number"
            name="teamFee"
            defaultValue={0}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Min Team Size
          </label>
          <input
            type="number"
            name="minTeamSize"
            defaultValue={1}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Max Team Size
          </label>
          <input
            type="number"
            name="maxTeamSize"
            defaultValue={1}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Event Date *
          </label>
          <input
            type="datetime-local"
            name="eventDate"
            required
            defaultValue="2026-04-15T10:00"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Reg. Open *
          </label>
          <input
            type="datetime-local"
            name="registrationOpen"
            required
            defaultValue="2026-03-01T00:00"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Reg. Close *
          </label>
          <input
            type="datetime-local"
            name="registrationClose"
            required
            defaultValue="2026-04-12T23:59"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Assign Event Manager
          </label>
          <select
            name="eventManagerId"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="">No manager assigned</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Publication Status
          </label>
          <select
            name="status"
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="DRAFT">DRAFT (Hidden from public)</option>
            <option value="PUBLISHED">PUBLISHED (Visible on website)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all disabled:opacity-50"
      >
        {isPending ? "Creating Event..." : "Create Event & Publish →"}
      </button>
    </form>
  );
}
