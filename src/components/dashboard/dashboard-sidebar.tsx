"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArohaLogo } from "@/components/aroha/aroha-logo";
import {
  Menu,
  X,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  UserCheck,
  Clock,
  Trophy,
  Settings,
  Award,
  User,
  Shield,
  Briefcase,
  LucideIcon,
} from "lucide-react";

export type SidebarIconName =
  | "dashboard"
  | "events"
  | "registrations"
  | "participants"
  | "managers"
  | "schedule"
  | "results"
  | "settings"
  | "certificates"
  | "profile"
  | "admin"
  | "manager"
  | "user";

const ICON_MAP: Record<SidebarIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  events: Calendar,
  registrations: ClipboardList,
  participants: Users,
  managers: UserCheck,
  schedule: Clock,
  results: Trophy,
  settings: Settings,
  certificates: Award,
  profile: User,
  admin: Shield,
  manager: Briefcase,
  user: User,
};

export interface SidebarLink {
  label: string;
  href: string;
  iconName?: SidebarIconName;
}

export interface DashboardSidebarProps {
  portalTitle: string;
  portalBadge?: string;
  user: {
    name: string;
    role: string;
    department?: string | null;
    college?: string | null;
  };
  links: SidebarLink[];
  extraLinks?: SidebarLink[];
  logoutAction: () => Promise<void> | void;
}

export function DashboardSidebar({
  portalTitle,
  portalBadge,
  user,
  links,
  extraLinks,
  logoutAction,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const renderNavContent = () => (
    <>
      <div>
        <div className="pb-5 border-b border-white/10 mb-5">
          <ArohaLogo size="sm" />
          <div className="mt-4 p-3 bg-[#111111] rounded border border-[#D4A72C]/30 shadow-inner">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#E5BE45] uppercase block truncate">
              {portalTitle}
            </span>
            <strong className="text-white text-xs block truncate mt-1">
              {user.name}
            </strong>
            <span className="text-[10px] text-[#FFF9EF]/60 block truncate mt-0.5">
              {user.department || user.college || user.role}
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" &&
                link.href !== "/manager" &&
                link.href !== "/dashboard" &&
                pathname.startsWith(link.href));

            const Icon = link.iconName ? ICON_MAP[link.iconName] : undefined;

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all group ${
                  isActive
                    ? "bg-[#E5BE45]/15 text-[#E5BE45] border-l-2 border-[#E5BE45] font-bold shadow-sm"
                    : "text-[#FFF9EF]/80 hover:text-[#E5BE45] hover:bg-[#111111]"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-[#E5BE45]"
                        : "text-[#E5BE45]/60 group-hover:text-[#E5BE45]"
                    }`}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}

          {extraLinks && extraLinks.length > 0 && (
            <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5">
              {extraLinks.map((link) => {
                const Icon = link.iconName ? ICON_MAP[link.iconName] : undefined;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/40 border border-amber-600/30 hover:bg-amber-900/50 transition-all"
                  >
                    {Icon && <Icon className="w-4 h-4 text-amber-400" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      <div className="pt-5 border-t border-white/10 mt-6 flex items-center justify-between text-xs">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center gap-1.5 text-[11px] text-[#FFF9EF]/60 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-[11px] text-red-400 font-bold uppercase tracking-wider hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Mobile Top Bar (Visible only on < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#171310]/95 backdrop-blur-md border-b border-[#D4A72C]/25 px-5 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <ArohaLogo size="sm" />
          {portalBadge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E5BE45]/15 text-[#E5BE45] border border-[#E5BE45]/30">
              {portalBadge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg bg-[#111111] border border-[#D4A72C]/30 text-[#E5BE45] hover:bg-[#E5BE45] hover:text-[#111111] transition-all flex items-center justify-center cursor-pointer shadow"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 2. Mobile Drawer & Backdrop (Visible only when mobileOpen is true on < md) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <aside className="relative w-[82%] max-w-xs bg-[#171310] border-r border-[#D4A72C]/30 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            {/* Close button inside drawer top-right */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-full bg-[#111111] border border-white/10 text-[#FFF9EF]/70 hover:text-white hover:border-[#E5BE45] transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {renderNavContent()}
          </aside>
        </div>
      )}

      {/* 3. Desktop Fixed Sidebar (Visible only on md+) */}
      <aside className="hidden md:flex w-64 bg-[#171310] border-r border-[#D4A72C]/20 p-6 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {renderNavContent()}
      </aside>
    </>
  );
}
