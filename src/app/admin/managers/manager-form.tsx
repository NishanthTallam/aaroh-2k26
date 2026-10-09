"use client";

import { useActionState, useState } from "react";
import { createManagerAction } from "@/actions/managers";

export function ManagerCreateForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createManagerAction, null);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 bg-[#8B1D1D] hover:bg-[#A32222] text-[#FFF9EF] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4A72C]/40 shadow-sm transition-all"
      >
        + Add Event Manager
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Add New Event Manager
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Creates an authorized credential with EVENT_MANAGER role.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-200">
                Event Manager created successfully!
              </div>
            )}

            <form
              action={async (formData) => {
                await formAction(formData);
                if (!state?.error) {
                  setTimeout(() => setOpen(false), 800);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Prof. Sarah Jenkins / Aryan Verma"
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="manager@aroha2k26.com"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Cultural Affairs / CSE"
                    className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5BE45] mb-1">
                  College / Institution
                </label>
                <input
                  type="text"
                  name="college"
                  defaultValue="Aroha University"
                  className="w-full bg-[#111111] border border-white/20 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#8B1D1D] hover:bg-[#A32222] text-white border border-[#D4A72C]/40 disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create Manager"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
