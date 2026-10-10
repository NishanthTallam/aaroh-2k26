import { requireManager } from "@/lib/auth/permissions";
import { logoutAction } from "@/actions/auth";
import { DashboardSidebar, type SidebarLink } from "@/components/dashboard/dashboard-sidebar";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireManager();

  const links: SidebarLink[] = [
    { label: "Dashboard", href: "/manager", iconName: "dashboard" },
    { label: "My Events", href: "/manager/events", iconName: "events" },
    { label: "Schedule Slots", href: "/manager/schedule", iconName: "schedule" },
  ];

  const extraLinks: SidebarLink[] = [
    { label: "Participant View", href: "/dashboard", iconName: "user" },
  ];
  if (user.role === "ADMIN") {
    extraLinks.push({ label: "Admin Panel →", href: "/admin", iconName: "admin" });
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFF9EF] flex flex-col md:flex-row">
      <DashboardSidebar
        portalTitle="EVENT MANAGER PORTAL"
        portalBadge="Coordinator"
        user={{
          name: user.name,
          role: user.role,
          department: user.department || user.college || "Festival Coordinator",
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
