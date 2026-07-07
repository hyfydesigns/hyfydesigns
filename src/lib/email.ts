// Server-only Resend helpers. Do not import from client components.
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

// Falls back to Resend's shared onboarding sender if the studio hasn't
// verified a domain yet. Once hyfydesigns.com is verified in Resend, set
// CONTACT_EMAIL_FROM to e.g. "HyFy Designs <hello@hyfydesigns.com>".
export const emailFrom =
  process.env.CONTACT_EMAIL_FROM || "HyFy Designs <onboarding@resend.dev>";
export const emailTo =
  process.env.CONTACT_EMAIL_TO || "hyfydesigns2020@gmail.com";
export const audienceId = process.env.RESEND_AUDIENCE_ID;

export const resend = apiKey ? new Resend(apiKey) : null;
export const hasResend = Boolean(resend);

export type StudioNotification = {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
};

export async function sendStudioNotification(
  params: StudioNotification,
): Promise<{ ok: boolean; mocked?: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.log(`[email mocked] to ${emailTo}: ${params.subject}`);
    return { ok: true, mocked: true };
  }
  const res = await resend.emails.send({
    from: emailFrom,
    to: [emailTo],
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
    attachments: params.attachments,
  });
  if (res.error) {
    console.error("[resend] send failed:", res.error);
    return { ok: false, error: res.error.message };
  }
  return { ok: true, id: res.data?.id };
}

export async function subscribeToNewsletter(
  email: string,
): Promise<{ ok: boolean; mocked?: boolean; error?: string }> {
  if (!resend) {
    console.log(`[newsletter mocked] ${email}`);
    return { ok: true, mocked: true };
  }

  let audienceContactCreated = false;
  if (audienceId) {
    try {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      audienceContactCreated = true;
    } catch (err) {
      // Duplicate contact is fine — swallow and continue to welcome email.
      const msg = (err as Error).message ?? "";
      if (/already exists|duplicate/i.test(msg)) {
        audienceContactCreated = true;
      } else {
        console.warn("[resend contacts.create]", msg);
      }
    }
  }

  // When the subscriber is in a Resend audience, Resend substitutes
  // {{{RESEND_UNSUBSCRIBE_URL}}} with a one-click unsubscribe link tied
  // to that audience. If they aren't (no audienceId configured), we fall
  // back to a mailto that lands in the studio inbox.
  const useResendLink = audienceContactCreated && Boolean(audienceId);
  const unsubscribeUrl = useResendLink
    ? "{{{RESEND_UNSUBSCRIBE_URL}}}"
    : `mailto:${emailTo}?subject=${encodeURIComponent("Unsubscribe me")}`;

  const welcome = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: "Welcome to HyFy Designs",
    html: welcomeHtml(unsubscribeUrl),
    // List-Unsubscribe headers let inbox providers (Gmail, Outlook, etc.)
    // show a native one-click unsubscribe button in the message header.
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (welcome.error) {
    console.error("[resend] welcome email failed:", welcome.error);
    return { ok: false, error: welcome.error.message };
  }
  return { ok: true };
}

function welcomeHtml(unsubscribeUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0A0A0A;">
      <h1 style="font-size: 24px; color: #0A2A6E; margin: 0 0 12px;">
        Welcome to HyFy Designs
      </h1>
      <p style="font-size: 15px; line-height: 1.6; color: #3D3D3A; margin: 0 0 16px;">
        Thanks for joining the list. Once a month you'll hear from us about new drops, studio picks, and a Houston playlist.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #3D3D3A; margin: 0 0 24px;">
        Talk soon,<br>
        The HyFy Designs studio<br>
        Houston, TX
      </p>
      <hr style="border: none; border-top: 1px solid #E6EEFB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B6B67; line-height: 1.55;">
        Changed your mind? You can
        <a href="${unsubscribeUrl}" style="color: #0A2A6E;">unsubscribe here</a>
        anytime — no hard feelings.
      </p>
    </div>
  `;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return c;
    }
  });
}
