import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { uploadToStorage, getPublicStorageUrl, BUCKETS } from "@/lib/storage/client";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
  }

  if (!session.user || !["ADMIN", "EVENT_MANAGER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden: Admin or Event Manager access required." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file || !file.size) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const key = `events/images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToStorage(key, buffer, file.type || "image/jpeg", BUCKETS.PUBLIC);

    const url = getPublicStorageUrl(key, BUCKETS.PUBLIC);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Event image upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
