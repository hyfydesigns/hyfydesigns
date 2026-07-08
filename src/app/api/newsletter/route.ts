import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email";

export async function POST(req: Request) {
  let email = "";
  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { email?: string };
      email = String(body.email ?? "").trim().toLowerCase();
    } else {
      const form = await req.formData();
      email = String(form.get("email") ?? "").trim().toLowerCase();
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const origin = new URL(req.url).origin;
  const result = await subscribeToNewsletter(email, origin);
  if (!result.ok && !result.mocked) {
    return NextResponse.json(
      { error: "We couldn't sign you up right now. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
