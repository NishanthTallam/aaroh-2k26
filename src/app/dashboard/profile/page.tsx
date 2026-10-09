import { requireAuth } from "@/lib/auth/permissions";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase block mb-1">
          PERSONAL DETAILS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          My Profile
        </h1>
        <p className="text-xs text-[#FFF9EF]/70 mt-1">
          Update your student identification and contact details used for event registrations and certificates.
        </p>
      </div>

      <div className="bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-6 sm:p-8 shadow-xl">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
