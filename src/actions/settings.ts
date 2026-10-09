"use server";

import { requireAdmin } from "@/lib/auth/permissions";
import { uploadToStorage, BUCKETS } from "@/lib/storage/client";
import { revalidatePath } from "next/cache";

export async function uploadPaymentQrAction(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData
) {
  await requireAdmin();

  const file = formData.get("paymentQr") as File | null;
  if (!file || file.size === 0) {
    return { error: "Please select an image file to upload." };
  }

  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return { error: "QR image must be PNG, JPG, or WebP." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadToStorage("aroha/payment/payment-qr.png", buffer, file.type, BUCKETS.PUBLIC);

  revalidatePath("/admin/settings");
  revalidatePath("/events");
  return { success: true };
}
