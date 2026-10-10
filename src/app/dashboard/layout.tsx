import { requireAuth } from "@/lib/auth/permissions";
import { logoutAction } from "@/actions/auth";
import { DashboardSidebar, type SidebarLink } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const links: SidebarLink[] = [
    { label: "Dashboard", href: "/dashboard", iconName: "dashboard" },
    { label: "My Registrations", href: "/dashboard/registrations", iconName: "registrations" },
    { label: "Certificates", href: "/dashboard/certificates", iconName: "certificates" },
    { label: "My Profile", href: "/dashboard/profile", iconName: "profile" },
  ];

  const extraLinks: SidebarLink[] = [];
  if (user.role === "ADMIN") {
    extraLinks.push({ label: "Admin Panel →", href: "/admin", iconName: "admin" });
  } else if (user.role === "EVENT_MANAGER") {
    extraLinks.push({ label: "Manager Panel →", href: "/manager", iconName: "manager" });
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#FFF9EF] flex flex-col md:flex-row">
      <DashboardSidebar
        portalTitle="PARTICIPANT DASHBOARD"
        portalBadge="Participant"
        user={{
          name: user.name,
          role: user.role,
          department: user.department,
          college: user.college,
        }}
        links={links}
        extraLinks={extraLinks}
        logoutAction={logoutAction}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">{children}</main>
    </div>
  );
}
