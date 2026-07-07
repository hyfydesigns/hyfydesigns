import { NextResponse } from "next/server";
import { escapeHtml, sendStudioNotification } from "@/lib/email";

// Cap total attachment payload to stay well under Resend's 40MB email limit.
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const type = String(form.get("type") ?? "").trim();
  const quantity = String(form.get("quantity") ?? "").trim();
  const deadline = String(form.get("deadline") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();

  const rawFiles = form.getAll("files").filter(
    (f): f is File => f instanceof File && f.size > 0,
  );

  // Dedupe by name+size to avoid the same file getting attached twice
  // (the form appends from both the input and the state array).
  const seen = new Set<string>();
  let bytes = 0;
  const filesToAttach: File[] = [];
  const skipped: string[] = [];
  for (const f of rawFiles) {
    const key = `${f.name}|${f.size}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (bytes + f.size > MAX_ATTACHMENT_BYTES) {
      skipped.push(`${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`);
      continue;
    }
    filesToAttach.push(f);
    bytes += f.size;
  }

  const attachments = await Promise.all(
    filesToAttach.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
    })),
  );

  if (!name || !email || !description) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; color: #0A0A0A;">
      <h2 style="color: #0A2A6E; margin: 0 0 12px;">New custom-order quote request</h2>
      <table style="border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">From:</td><td>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">Type:</td><td>${escapeHtml(type)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">Quantity:</td><td>${escapeHtml(quantity)}</td></tr>
        ${deadline ? `<tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">Deadline:</td><td>${escapeHtml(deadline)}</td></tr>` : ""}
        <tr><td style="padding: 4px 12px 4px 0; color: #6B6B67;">Files:</td><td>${attachments.length} attached${skipped.length ? `, ${skipped.length} skipped (over 20MB total): ${skipped.map(escapeHtml).join(", ")}` : ""}</td></tr>
      </table>
      <div style="font-size: 12px; color: #6B6B67; margin-bottom: 4px;">DESCRIPTION</div>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #F7F2E4; border-left: 3px solid #E02D2D; border-radius: 4px; font-size: 14px; line-height: 1.55;">${escapeHtml(description)}</div>
      <p style="font-size: 12px; color: #6B6B67; margin-top: 16px;">
        Reply directly to this email to respond to the customer.
      </p>
    </div>
  `;

  await sendStudioNotification({
    subject: `Quote request: ${type || "Custom project"}${quantity ? ` (${quantity})` : ""}`,
    html,
    replyTo: email,
    attachments,
  });

  return NextResponse.json({ ok: true });
}
