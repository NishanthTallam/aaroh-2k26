import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const BUCKETS = {
  PRIVATE: process.env.AWS_PRIVATE_BUCKET_NAME || "aaroh-private",
  PUBLIC: process.env.AWS_PUBLIC_BUCKET_NAME || "aaroh-public",
} as const;

export type BucketName = typeof BUCKETS.PRIVATE | typeof BUCKETS.PUBLIC | string;

export const BUCKET_NAME = BUCKETS.PRIVATE;

// Neon Object Storage requires path-style addressing (forcePathStyle: true)
export const s3 = new S3Client({
  forcePathStyle: true,
  region: process.env.AWS_REGION || "us-east-2",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToStorage(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType = "application/octet-stream",
  bucket: string = BUCKETS.PRIVATE
): Promise<string> {
  const buffer =
    body instanceof Buffer
      ? body
      : body instanceof Uint8Array
      ? Buffer.from(body)
      : typeof body === "string"
      ? Buffer.from(body)
      : Buffer.from(await (body as Blob).arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return key;
}

export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600,
  bucket: string = BUCKETS.PRIVATE
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

export function getPublicStorageUrl(
  key: string,
  bucket: string = BUCKETS.PUBLIC
): string {
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 || "").replace(/\/$/, "");
  return `${endpoint}/${bucket}/${key}`;
}

export async function deleteFromStorage(
  key: string,
  bucket: string = BUCKETS.PRIVATE
): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}
