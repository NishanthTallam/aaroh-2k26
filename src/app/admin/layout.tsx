import { requireAdmin } from "@/lib/auth/permissions";
import { logoutAction } from "@/actions/auth";
import { DashboardSidebar, type SidebarLink } from "@/components/dashboard/dashboard-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  const links: SidebarLink[] = [
    { label: "Dashboard", href: "/admin", iconName: "dashboard" },
    { label: "Events", href: "/admin/events", iconName: "events" },
    { label: "Registrations", href: "/admin/registrations", iconName: "registrations" },
    { label: "Participants", href: "/admin/participants", iconName: "participants" },
    { label: "Event Managers", href: "/admin/managers", iconName: "managers" },
    { label: "Schedule", href: "/admin/schedule", iconName: "schedule" },
    { label: "Results", href: "/admin/results", iconName: "results" },
    { label: "Settings", href: "/admin/settings", iconName: "settings" },
  ];

  const extraLinks: SidebarLink[] = [
    { label: "Manager Panel", href: "/manager", iconName: "manager" },
    { label: "Participant View", href: "/dashboard", iconName: "user" },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFF9EF] flex flex-col md:flex-row">
      <DashboardSidebar
        portalTitle="CONTROL CENTER"
        portalBadge="Admin"
        user={{
          name: user.name,
          role: user.role,
          department: user.department || "Festival Convenor Committee",
          college: user.college,
        }}
        links={links}
        extraLinks={extraLinks}
        logoutAction={logoutAction}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">{children}</main>
    </div>
  );
}
