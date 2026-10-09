"use client";

import { useState } from "react";

type ParticipantItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  department: string | null;
  year: string | null;
  rollNumber: string | null;
  createdAt: Date;
  registrationsCount: number;
};

export function ParticipantsTable({
  participants,
}: {
  participants: ParticipantItem[];
}) {
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("ALL");

  const colleges = Array.from(
    new Set(participants.map((p) => p.college || "N/A"))
  );

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone && p.phone.includes(search)) ||
      (p.rollNumber && p.rollNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCollege =
      collegeFilter === "ALL" || (p.college || "N/A") === collegeFilter;

    return matchesSearch && matchesCollege;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, roll number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1F1813] border border-[#D4A72C]/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4A72C]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-white/60">College:</label>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="bg-[#1F1813] border border-[#D4A72C]/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4A72C]"
          >
            <option value="ALL">All Colleges ({participants.length})</option>
            {colleges.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#171310] border border-[#D4A72C]/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#D4A72C]/20 text-[#E5BE45] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">College & Dept</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5 text-center">Registrations</th>
                <th className="px-5 py-3.5 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/50">
                    No participants found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E5BE45]/10 border border-[#E5BE45]/30 flex items-center justify-center font-bold text-[#E5BE45] text-xs shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="block text-white font-medium">
                            {p.name}
                          </strong>
                          <span className="text-[11px] text-white/50">
                            {p.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      <div>{p.college || "N/A"}</div>
                      <div className="text-[11px] text-white/50">
                        {p.department || "General"} {p.year ? `(${p.year})` : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-white/70">
                      {p.rollNumber || "—"}
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      {p.phone || "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E5BE45]/15 text-[#E5BE45] border border-[#E5BE45]/30">
                        {p.registrationsCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-white/50 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#D4A72C]/20 bg-[#111111] flex justify-between items-center text-[11px] text-white/60">
          <span>Showing {filtered.length} of {participants.length} registered students</span>
        </div>
      </div>
    </div>
  );
}
