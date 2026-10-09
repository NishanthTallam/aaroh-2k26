import {
  uploadToStorage,
  getPresignedDownloadUrl,
  getPublicStorageUrl,
  BUCKETS,
} from "./client";

export async function uploadCertificatePdf(
  certificateId: string,
  pdfBuffer: Buffer
): Promise<string> {
  const path = `aroha/certificates/${certificateId}.pdf`;
  return await uploadToStorage(path, pdfBuffer, "application/pdf", BUCKETS.PUBLIC);
}

export async function uploadRegistrationQr(
  registrationId: string,
  qrBuffer: Buffer
): Promise<string> {
  const path = `aroha/qrs/${registrationId}.png`;
  return await uploadToStorage(path, qrBuffer, "image/png", BUCKETS.PUBLIC);
}

export async function uploadPaymentScreenshot(
  registrationId: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
    ? "webp"
    : "jpg";
  const path = `aroha/payment-screenshots/${registrationId}.${ext}`;
  // Participant payment screenshots contain financial/UTR data -> aaroh-private
  return await uploadToStorage(path, fileBuffer, contentType, BUCKETS.PRIVATE);
}

export async function getFileViewUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  // Select bucket based on path convention
  const isPrivate = storagePath.startsWith("aroha/payment-screenshots");
  const bucket = isPrivate ? BUCKETS.PRIVATE : BUCKETS.PUBLIC;

  try {
    return await getPresignedDownloadUrl(storagePath, expiresIn, bucket);
  } catch (err) {
    if (!isPrivate) {
      // Fallback to public URL for public bucket assets
      return getPublicStorageUrl(storagePath, BUCKETS.PUBLIC);
    }
    throw err;
  }
}
