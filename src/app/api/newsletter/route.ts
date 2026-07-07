import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    await subscribeToNewsletter(email);
  }

  return NextResponse.redirect(new URL("/?subscribed=1", req.url), 303);
}
