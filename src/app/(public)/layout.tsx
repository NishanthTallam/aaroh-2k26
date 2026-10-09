import { Navbar } from "@/components/aroha/navbar";
import { Footer } from "@/components/aroha/footer";
import { getSession } from "@/lib/auth/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-[#FFF9EF]">
      <Navbar userRole={session?.user?.role || null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
