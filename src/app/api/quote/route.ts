import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const payload = {
    name: form.get("name"),
    email: form.get("email"),
    type: form.get("type"),
    quantity: form.get("quantity"),
    deadline: form.get("deadline"),
    description: form.get("description"),
    fileCount: form.getAll("files").length,
  };

  // TODO: forward to Resend + upload files to Cloudinary/Uploadthing
  console.log("[quote request]", payload);

  return NextResponse.json({ ok: true });
}
