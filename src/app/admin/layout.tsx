import { requireAdmin } from "@/lib/auth/permissions";
import { ArohaLogo } from "@/components/aroha/aroha-logo";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  UserCheck,
  Clock,
  Trophy,
  Settings,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
    { label: "Participants", href: "/admin/participants", icon: Users },
    { label: "Event Managers", href: "/admin/managers", icon: UserCheck },
    { label: "Schedule", href: "/admin/schedule", icon: Clock },
    { label: "Results", href: "/admin/results", icon: Trophy },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFF9EF] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#171310] border-b md:border-b-0 md:border-r border-[#D4A72C]/20 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="pb-6 border-b border-white/10 mb-6">
            <ArohaLogo size="sm" />
            <div className="mt-4 p-3 bg-[#111111] rounded border border-[#D4A72C]/30">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#E5BE45] uppercase block">
                CONTROL CENTER
              </span>
              <strong className="text-white text-xs block truncate mt-0.5">
                {user.name}
              </strong>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[#FFF9EF]/80 hover:text-[#E5BE45] hover:bg-[#111111] transition-all group"
              >
                <link.icon className="w-4 h-4 text-[#E5BE45]/70 group-hover:text-[#E5BE45] transition-colors" />
                <span>{link.label}</span>
              </Link>
            ))}
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

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">{children}</main>
    </div>
  );
}
