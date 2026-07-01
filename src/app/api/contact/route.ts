import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const payload = {
    name: form.get("name"),
    email: form.get("email"),
    subject: form.get("subject"),
    message: form.get("message"),
  };
  console.log("[contact form]", payload);
  return NextResponse.json({ ok: true });
}
