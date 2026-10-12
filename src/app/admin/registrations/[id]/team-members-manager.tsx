"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  Crown,
  CheckCircle2,
  Phone,
  Mail,
  Hash,
  Building,
  GraduationCap,
} from "lucide-react";
import {
  addTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
  updateRegistrationTeamNameAction,
  convertToTeamRegistrationAction,
} from "@/actions/registrations";

export interface MemberData {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  year?: string | null;
  department?: string | null;
}

interface TeamMembersManagerProps {
  registrationId: string;
  registrationType: string;
  teamName: string | null;
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    rollNumber: string | null;
    college?: string | null;
    department?: string | null;
  };
  members: MemberData[];
  minTeamSize: number;
  maxTeamSize: number;
  eventRegistrationType: string;
}

export function AdminTeamMembersManager({
  registrationId,
  registrationType,
  teamName: initialTeamName,
  participant,
  members,
  minTeamSize,
  maxTeamSize,
  eventRegistrationType,
}: TeamMembersManagerProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Team Name Editing state
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(initialTeamName || "");

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    department: "",
    year: "",
  });

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    department: "",
    year: "",
  });

  // Delete Member Confirm State
  const [deletingMember, setDeletingMember] = useState<MemberData | null>(null);

  const isTeam = registrationType === "TEAM";
  const currentTotal = 1 + members.length; // Captain + members
  const canAdd = currentTotal < maxTeamSize;
  const canDelete = currentTotal > minTeamSize;

  const showNotification = (success?: string, error?: string) => {
    if (success) {
      setSuccessMessage(success);
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
    if (error) {
      setErrorMessage(error);
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  // Convert Solo to Team
  const handleConvertToTeam = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await convertToTeamRegistrationAction(registrationId);
      if (res.error) {
        showNotification(undefined, res.error);
      } else {
        showNotification("Registration converted to TEAM entry! You can now manage team members.");
        router.refresh();
      }
    } catch {
      showNotification(undefined, "Failed to convert registration to Team.");
    } finally {
      setLoading(false);
    }
  };

  // Save Team Name
  const handleSaveTeamName = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await updateRegistrationTeamNameAction({
        registrationId,
        teamName: teamNameInput,
      });
      if (res.error) {
        showNotification(undefined, res.error);
      } else {
        showNotification("Team name updated successfully!");
        setIsEditingTeamName(false);
        router.refresh();
      }
    } catch {
      showNotification(undefined, "Failed to update team name.");
    } finally {
      setLoading(false);
    }
  };

  // Add Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.rollNumber.trim() || !addForm.email.trim() || !addForm.phone.trim()) {
      showNotification(undefined, "Please fill in all required fields (Name, Roll No, Email, Phone).");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await addTeamMemberAction({
        registrationId,
        name: addForm.name,
        rollNumber: addForm.rollNumber,
        email: addForm.email,
        phone: addForm.phone,
        department: addForm.department || null,
        year: addForm.year || null,
      });

      if (res.error) {
        showNotification(undefined, res.error);
      } else {
        showNotification(`Team member ${addForm.name} added successfully!`);
        setShowAddModal(false);
        setAddForm({
          name: "",
          rollNumber: "",
          email: "",
          phone: "",
          department: "",
          year: "",
        });
        router.refresh();
      }
    } catch {
      showNotification(undefined, "Failed to add team member.");
    } finally {
      setLoading(false);
    }
  };

  // Start Edit Member
  const startEditMember = (member: MemberData) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      rollNumber: member.rollNumber,
      email: member.email,
      phone: member.phone,
      department: member.department || "",
      year: member.year || "",
    });
  };

  // Save Edit Member
  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editForm.name.trim() || !editForm.rollNumber.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      showNotification(undefined, "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await updateTeamMemberAction({
        memberId: editingMember.id,
        registrationId,
        name: editForm.name,
        rollNumber: editForm.rollNumber,
        email: editForm.email,
        phone: editForm.phone,
        department: editForm.department || null,
        year: editForm.year || null,
      });

      if (res.error) {
        showNotification(undefined, res.error);
      } else {
        showNotification(`Member ${editForm.name} updated successfully!`);
        setEditingMember(null);
        router.refresh();
      }
    } catch {
      showNotification(undefined, "Failed to update member.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async () => {
    if (!deletingMember) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await deleteTeamMemberAction({
        memberId: deletingMember.id,
        registrationId,
      });

      if (res.error) {
        showNotification(undefined, res.error);
      } else {
        showNotification(`Member ${deletingMember.name} removed from roster.`);
        setDeletingMember(null);
        router.refresh();
      }
    } catch {
      showNotification(undefined, "Failed to delete member.");
    } finally {
      setLoading(false);
    }
  };

  // If Solo registration and event allows team
  if (!isTeam) {
    if (eventRegistrationType === "TEAM" || eventRegistrationType === "BOTH" || maxTeamSize > 1) {
      return (
        <div className="bg-[#171310] border border-white/10 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E5BE45]" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase">
                Team Management
              </h2>
            </div>
            <span className="text-[10px] text-white/50 uppercase">Current: Solo Entry</span>
          </div>

          <p className="text-xs text-[#FFF9EF]/70 leading-relaxed">
            This entry is currently registered as <span className="text-white font-bold">SOLO</span>, but this event supports team participation (Up to {maxTeamSize} members). You can convert this entry into a team to add and manage teammates.
          </p>

          <button
            type="button"
            disabled={loading}
            onClick={handleConvertToTeam}
            className="w-full py-2.5 px-4 bg-[#111111] hover:bg-[#E5BE45] text-[#E5BE45] hover:text-black border border-[#D4A72C]/40 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enable Team Roster for this Entry</span>
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="bg-[#171310] border border-white/10 rounded-lg p-6 space-y-5">
      {/* Header with Title and Team Size Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E5BE45]" />
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase">
              Team Roster ({currentTotal} Members)
            </h2>
          </div>
          <span className="text-[11px] text-white/60 block mt-0.5">
            Allowed Size: <strong className="text-white">{minTeamSize}</strong> to <strong className="text-white">{maxTeamSize}</strong> members (Captain + Teammates)
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Status Badge */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
              currentTotal >= maxTeamSize
                ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                : currentTotal < minTeamSize
                ? "bg-red-950/60 text-red-400 border-red-800/60"
                : "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
            }`}
          >
            {currentTotal >= maxTeamSize
              ? "Max Capacity Reached"
              : `${maxTeamSize - currentTotal} Slot(s) Available`}
          </span>

          {/* Add Member Button */}
          <button
            type="button"
            disabled={!canAdd || loading}
            onClick={() => {
              setErrorMessage(null);
              setShowAddModal(true);
            }}
            title={!canAdd ? `Maximum team size (${maxTeamSize}) reached` : "Add team member"}
            className="px-2.5 py-1 bg-[#E5BE45] hover:bg-[#f3cc52] text-black text-[11px] font-bold uppercase tracking-wider rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <UserPlus className="w-3 h-3" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 rounded text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Team Name Line */}
      <div className="flex items-center justify-between p-3 bg-[#111111] rounded border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/50 uppercase font-semibold">Team Name:</span>
          {isEditingTeamName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                placeholder="Enter team name"
                className="px-2 py-1 bg-[#1A1512] border border-white/20 rounded text-xs text-white focus:outline-none focus:border-[#E5BE45]"
              />
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveTeamName}
                className="p-1 text-emerald-400 hover:text-emerald-300"
                title="Save team name"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTeamNameInput(initialTeamName || "");
                  setIsEditingTeamName(false);
                }}
                className="p-1 text-white/50 hover:text-white"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-white text-xs font-bold">
              {initialTeamName || <span className="text-white/40 italic">Not set</span>}
            </span>
          )}
        </div>

        {!isEditingTeamName && (
          <button
            type="button"
            onClick={() => setIsEditingTeamName(true)}
            className="text-[10px] text-[#E5BE45] hover:underline flex items-center gap-1 font-semibold"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit Name</span>
          </button>
        )}
      </div>

      {/* Captain Card */}
      <div className="p-3.5 bg-gradient-to-r from-[#1b1510] to-[#120e0b] rounded border border-[#E5BE45]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5BE45]/20 border border-[#E5BE45] flex items-center justify-center text-[#E5BE45] shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white text-xs font-semibold">{participant.name}</strong>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#9E1B23]/40 text-[#E5BE45] border border-[#9E1B23]">
                  Captain (Lead)
                </span>
              </div>
              <span className="text-[11px] text-white/60 block">
                {participant.rollNumber || "N/A"} • {participant.email} • {participant.phone || "N/A"}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-white/40 font-mono hidden sm:inline">Member #1</span>
        </div>
      </div>

      {/* Additional Members List */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
          Registered Teammates ({members.length})
        </span>

        {members.length === 0 ? (
          <div className="p-6 bg-[#111111] rounded border border-dashed border-white/10 text-center space-y-2">
            <Users className="w-6 h-6 mx-auto text-white/30" />
            <p className="text-xs text-[#FFF9EF]/60">
              No additional team members registered yet.
            </p>
            {canAdd && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="text-xs text-[#E5BE45] hover:underline font-bold inline-flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Add first teammate (Required minimum: {minTeamSize})</span>
              </button>
            )}
          </div>
        ) : (
          members.map((m, idx) => (
            <div
              key={m.id}
              className="p-3.5 bg-[#111111] rounded border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#E5BE45] font-semibold bg-[#171310] px-1.5 py-0.5 rounded border border-white/5">
                    #{idx + 2}
                  </span>
                  <strong className="text-white text-xs font-medium group-hover:text-[#E5BE45] transition-colors">
                    {m.name}
                  </strong>
                  <span className="font-mono text-[11px] text-[#FFF9EF]/70">
                    ({m.rollNumber})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3 text-white/40" />
                    <span>{m.email}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 text-white/40" />
                    <span>{m.phone}</span>
                  </span>
                  {(m.department || m.year) && (
                    <span className="text-white/40">
                      {[m.department, m.year].filter(Boolean).join(" • ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Member */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => startEditMember(m)}
                  className="px-2.5 py-1 bg-[#1A1512] hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3 text-[#E5BE45]" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  disabled={!canDelete || loading}
                  onClick={() => setDeletingMember(m)}
                  title={
                    !canDelete
                      ? `Cannot delete: Event requires at least ${minTeamSize} members`
                      : `Remove ${m.name}`
                  }
                  className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#E5BE45]" />
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  Add Team Member (#{currentTotal + 1} of {maxTeamSize})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Roll Number / Reg ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.rollNumber}
                    onChange={(e) => setAddForm({ ...addForm, rollNumber: e.target.value })}
                    placeholder="e.g. 22B91A0501"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Department (Optional)
                  </label>
                  <input
                    type="text"
                    value={addForm.department}
                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                    placeholder="e.g. CSE / ECE"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Year / Semester (Optional)
                  </label>
                  <input
                    type="text"
                    value={addForm.year}
                    onChange={(e) => setAddForm({ ...addForm, year: e.target.value })}
                    placeholder="e.g. 3rd Year"
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#111111] text-white/70 hover:text-white rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#E5BE45] hover:bg-[#f3cc52] text-black rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add to Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171310] border border-[#D4A72C]/40 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#E5BE45]" />
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  Edit Member Details ({editingMember.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Roll Number / Reg ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.rollNumber}
                    onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Department (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block uppercase tracking-wider text-[10px]">
                    Year / Semester (Optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded text-white focus:outline-none focus:border-[#E5BE45]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-[#111111] text-white/70 hover:text-white rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#E5BE45] hover:bg-[#f3cc52] text-black rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#171310] border border-red-500/40 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-red-400">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold tracking-wider uppercase">
                Remove Team Member
              </h3>
            </div>

            <p className="text-xs text-[#FFF9EF]/80 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">{deletingMember.name}</strong> ({deletingMember.rollNumber}) from this team entry?
            </p>

            <div className="p-3 bg-neutral-900 rounded text-[11px] text-white/60">
              Team size after removal: {currentTotal - 1} members (Minimum required: {minTeamSize}).
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                className="px-4 py-2 bg-[#111111] text-white/70 hover:text-white rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteMember}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? "Removing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
