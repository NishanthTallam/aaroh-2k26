"use client";

import { useActionState, useRef, useState } from "react";
import { updateEventAction } from "@/actions/events";
import type { Event, Profile } from "@/db/schema";
import Image from "next/image";
import { ImagePlus, AlertCircle } from "lucide-react";

function EventImageUpload({ currentImageUrl }: { currentImageUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentImageUrl || "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/events/upload-image", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadedUrl(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
        Event Banner Image
      </label>
      <input type="hidden" name="imageUrl" value={uploadedUrl} />
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer border-2 border-dashed border-[#D4A72C]/30 hover:border-[#E5BE45] rounded-xl overflow-hidden transition-all"
        style={{ minHeight: "160px" }}
      >
        {preview ? (
          <div className="relative w-full h-40">
            <Image
              src={preview}
              alt="Event banner preview"
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-[#FFF9EF]/50 gap-2 p-4">
            <ImagePlus className="w-8 h-8 text-[#E5BE45]/70 mb-1" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FFF9EF]/70">Click to upload banner image</span>
            <span className="text-[10px]">JPG, PNG, WEBP • Recommended 16:9</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[#E5BE45] text-xs font-bold animate-pulse">Uploading...</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface EventEditFormProps {
  event: Event;
  managers: Profile[];
}

export function EventEditForm({ event, managers }: EventEditFormProps) {
  const [state, formAction, isPending] = useActionState(updateEventAction, null);

  const formatDateForInput = (d: Date) => {
    return new Date(d).toISOString().slice(0, 16);
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={event.id} />

      {state?.error && (
        <div className="p-3 bg-red-950/70 border border-red-500/50 rounded text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{state.error}</span>
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
            defaultValue={event.name}
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
            defaultValue={event.category}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="CULTURAL">Culturals</option>
            <option value="SPORTS">Sports</option>
            <option value="CREATIVE_MEDIA">Creative Media</option>
            <option value="FOOD_FEST">Food Fest</option>
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
          defaultValue={event.description}
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
          defaultValue={event.rules || ""}
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
            defaultValue={event.venue}
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
            defaultValue={event.registrationType}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="SOLO">Solo Only</option>
            <option value="TEAM">Team Only</option>
            <option value="BOTH">Both (Solo & Team)</option>
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
            defaultValue={event.soloFee}
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
            defaultValue={event.teamFee}
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
            defaultValue={event.minTeamSize}
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
            defaultValue={event.maxTeamSize}
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
            defaultValue={formatDateForInput(event.eventDate)}
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
            defaultValue={formatDateForInput(event.registrationOpen)}
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
            defaultValue={formatDateForInput(event.registrationClose)}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold tracking-wider text-[#FFF9EF]/80 uppercase block mb-1.5">
            Event Manager
          </label>
          <select
            name="eventManagerId"
            defaultValue={event.eventManagerId || ""}
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
            Status
          </label>
          <select
            name="status"
            defaultValue={event.status}
            className="w-full px-3.5 py-2.5 bg-[#111111] border border-[#D4A72C]/20 rounded text-sm text-white focus:outline-none focus:border-[#E5BE45]"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      <EventImageUpload currentImageUrl={event.imageUrl || null} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-[#9E1B23] text-white font-bold text-xs uppercase tracking-wider rounded border border-[#E5BE45]/30 hover:bg-[#C62828] transition-all disabled:opacity-50"
      >
        {isPending ? "Updating Event..." : "Save Changes"}
      </button>
    </form>
  );
}
