import { NextResponse } from "next/server";
import { escapeHtml, sendStudioNotification } from "@/lib/email";

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const subject = String(form.get("subject") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; color: #0A0A0A;">
      <h2 style="color: #0A2A6E; margin: 0 0 12px;">New contact form message</h2>
      <table style="border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">From:</td><td>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">Subject:</td><td>${escapeHtml(subject || "(none)")}</td></tr>
      </table>
      <div style="font-size: 12px; color: #6B6B67; margin-bottom: 4px;">MESSAGE</div>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #F7F2E4; border-left: 3px solid #0A2A6E; border-radius: 4px; font-size: 14px; line-height: 1.55;">${escapeHtml(message)}</div>
      <p style="font-size: 12px; color: #6B6B67; margin-top: 16px;">
        Reply directly to this email to respond to the customer.
      </p>
    </div>
  `;

  await sendStudioNotification({
    subject: `Contact: ${subject || `Message from ${name}`}`,
    html,
    replyTo: email,
  });

  return NextResponse.json({ ok: true });
}
