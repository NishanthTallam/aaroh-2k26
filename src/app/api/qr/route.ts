import { NextResponse } from "next/server";

// TODO: implement QR generation endpoint
export async function GET() {
  return NextResponse.json({ message: "QR endpoint" });
}
