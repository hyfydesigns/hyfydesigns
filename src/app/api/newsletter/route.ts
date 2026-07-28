import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email";
import { isLikelyBot } from "@/lib/spam-guard";

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isLikelyBot(form)) {
    return NextResponse.json({ ok: true });
  }

  const email = String(form.get("email") ?? "").trim().toLowerCase();

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
