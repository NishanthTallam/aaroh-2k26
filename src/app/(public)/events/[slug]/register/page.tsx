import { notFound, redirect } from "next/navigation";
import { getEventBySlug } from "@/db/queries/events";
import { getSession } from "@/lib/auth/session";
import { getPresignedDownloadUrl, BUCKETS } from "@/lib/storage/client";
import { RegistrationForm } from "@/components/registration/registration-form";
import Link from "next/link";

interface RegisterPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventRegistrationPage({
  params,
}: RegisterPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const session = await getSession();
  if (!session) {
    redirect(`/auth/login?redirect=/events/${slug}/register`);
  }

  let paymentQrUrl: string | null = null;
  try {
    paymentQrUrl = await getPresignedDownloadUrl("aroha/payment/payment-qr.png", 3600, BUCKETS.PUBLIC);
  } catch {
    paymentQrUrl = null;
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-14 max-w-4xl mx-auto">
      <Link
        href={`/events/${slug}`}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#E5BE45] hover:text-white mb-8 transition-colors"
      >
        ← Back to {event.name}
      </Link>

      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-2">
          OFFICIAL FESTIVAL REGISTRATION
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">
          Register for {event.name}
        </h1>
        <p className="text-sm text-[#FFF9EF]/70">
          Category: {event.category.replace("_", " ")} • Venue: {event.venue}
        </p>
      </div>

      <div className="bg-[#1A1512] border border-[#D4A72C]/30 rounded-lg p-6 sm:p-10 shadow-2xl">
        <RegistrationForm
          event={event}
          user={session.user}
          paymentQrUrl={paymentQrUrl}
        />
      </div>
    </div>
  );
}
