import { requireManager } from "@/lib/auth/permissions";
import { getEventById } from "@/db/queries/events";
import { getEventRegistrationsDetailed } from "@/db/queries/registrations";
import { getFileViewUrl } from "@/lib/storage/certificates";
import { ManagerRegistrationList } from "./manager-registration-list";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ManagerEventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireManager();
  const { id } = await params;

  const event = await getEventById(id);
  if (!event) notFound();

  // Scoped authorization
  if (event.eventManagerId !== user.id && user.role !== "ADMIN") {
    redirect("/manager/events");
  }

  const rawRegistrations = await getEventRegistrationsDetailed(id);

  // Generate presigned URLs for payment screenshots
  const registrationsWithUrls = await Promise.all(
    rawRegistrations.map(async (r) => {
      let paymentScreenshotUrl: string | null = null;
      if (r.paymentScreenshotPath) {
        try {
          paymentScreenshotUrl = await getFileViewUrl(r.paymentScreenshotPath);
        } catch {
          paymentScreenshotUrl = null;
        }
      }

      return {
        ...r,
        paymentScreenshotUrl,
      };
    })
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/manager/events/${event.id}`}
            className="text-xs text-[#E5BE45] hover:underline"
          >
            ← {event.name} Overview
          </Link>
          <span className="text-white/40">•</span>
          <span className="text-xs uppercase font-bold tracking-wider text-white/60">
            Audit Entries
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">
          Registrations & Payment Audit
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Review participant applications, verify UTR payments against screenshots, and approve tickets.
        </p>
      </div>

      <ManagerRegistrationList
        registrations={registrationsWithUrls}
        eventName={event.name}
      />
    </div>
  );
}
