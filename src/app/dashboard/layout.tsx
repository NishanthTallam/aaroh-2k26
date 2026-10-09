import { requireAuth } from "@/lib/auth/permissions";
import { ArohaLogo } from "@/components/aroha/aroha-logo";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Registrations", href: "/dashboard/registrations" },
    { label: "Certificates", href: "/dashboard/certificates" },
    { label: "My Profile", href: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFF9EF] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1512] border-b md:border-b-0 md:border-r border-[#D4A72C]/20 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="pb-6 border-b border-white/10 mb-6">
            <ArohaLogo size="sm" />
            <div className="mt-4 p-3 bg-[#111111] rounded border border-white/5">
              <strong className="text-white text-xs block truncate">{user.name}</strong>
              <span className="text-[10px] text-[#E5BE45] font-semibold uppercase tracking-wider block">
                {user.role}
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[#FFF9EF]/80 hover:text-[#E5BE45] hover:bg-[#111111] transition-all"
              >
                {link.label}
              </Link>
            ))}

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="mt-4 px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/40 border border-amber-600/30"
              >
                Admin Panel →
              </Link>
            )}

            {user.role === "EVENT_MANAGER" && (
              <Link
                href="/manager"
                className="mt-4 px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/40 border border-amber-600/30"
              >
                Manager Panel →
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] text-[#FFF9EF]/60 hover:text-white uppercase tracking-wider"
          >
            ← Public Site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-[11px] text-red-400 font-bold uppercase tracking-wider hover:underline"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">{children}</main>
    </div>
  );
}
