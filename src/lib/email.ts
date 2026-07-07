// Server-only Resend helpers. Do not import from client components.
import { Resend } from "resend";
import { sanityFetch } from "@/sanity/client";
import { EMAIL_SETTINGS_QUERY } from "@/sanity/queries";
import type { EmailSettingsDoc, EmailTemplate } from "@/sanity/types";

const apiKey = process.env.RESEND_API_KEY;

export const emailFrom =
  process.env.CONTACT_EMAIL_FROM || "HyFy Designs <onboarding@resend.dev>";
export const emailTo =
  process.env.CONTACT_EMAIL_TO || "hyfydesigns2020@gmail.com";
export const audienceId = process.env.RESEND_AUDIENCE_ID;

export const resend = apiKey ? new Resend(apiKey) : null;
export const hasResend = Boolean(resend);

// -----------------------------------------------------------------
// Studio notifications (existing behavior for contact + quote forms)
// -----------------------------------------------------------------

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

// -----------------------------------------------------------------
// Newsletter subscribe + welcome email (uses Sanity template)
// -----------------------------------------------------------------

export async function subscribeToNewsletter(
  email: string,
  name?: string,
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
      const msg = (err as Error).message ?? "";
      if (/already exists|duplicate/i.test(msg)) {
        audienceContactCreated = true;
      } else {
        console.warn("[resend contacts.create]", msg);
      }
    }
  }

  const useResendLink = audienceContactCreated && Boolean(audienceId);
  const unsubscribeUrl = useResendLink
    ? "{{{RESEND_UNSUBSCRIBE_URL}}}"
    : `mailto:${emailTo}?subject=${encodeURIComponent("Unsubscribe me")}`;

  const settings = await getEmailSettings();
  const rendered = renderTemplate(
    settings?.welcome,
    DEFAULT_WELCOME,
    { name, email },
    {
      unsubscribeUrl,
      unsubscribeLabel: "Changed your mind? Unsubscribe here — no hard feelings.",
    },
  );

  const send = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: rendered.subject,
    html: rendered.html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (send.error) {
    console.error("[resend] welcome email failed:", send.error);
    return { ok: false, error: send.error.message };
  }
  return { ok: true };
}

// -----------------------------------------------------------------
// Customer auto-response emails (contact + quote)
// -----------------------------------------------------------------

export async function sendContactAutoResponse(
  email: string,
  name?: string,
): Promise<void> {
  if (!resend) return;
  const settings = await getEmailSettings();
  const rendered = renderTemplate(
    settings?.contactResponse,
    DEFAULT_CONTACT_RESPONSE,
    { name, email },
  );
  const res = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: rendered.subject,
    html: rendered.html,
    replyTo: emailTo,
  });
  if (res.error) {
    console.error("[resend] contact auto-response failed:", res.error);
  }
}

export async function sendQuoteAutoResponse(
  email: string,
  name?: string,
): Promise<void> {
  if (!resend) return;
  const settings = await getEmailSettings();
  const rendered = renderTemplate(
    settings?.quoteResponse,
    DEFAULT_QUOTE_RESPONSE,
    { name, email },
  );
  const res = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: rendered.subject,
    html: rendered.html,
    replyTo: emailTo,
  });
  if (res.error) {
    console.error("[resend] quote auto-response failed:", res.error);
  }
}

// -----------------------------------------------------------------
// Sanity template loading + rendering
// -----------------------------------------------------------------

async function getEmailSettings(): Promise<EmailSettingsDoc | null> {
  return sanityFetch<EmailSettingsDoc | null>(EMAIL_SETTINGS_QUERY, {}, null);
}

type RenderVars = { name?: string; email?: string };

type Footer = {
  unsubscribeUrl?: string;
  unsubscribeLabel?: string;
};

function renderTemplate(
  template: EmailTemplate | undefined,
  fallback: EmailTemplate,
  vars: RenderVars,
  footer?: Footer,
): { subject: string; html: string } {
  const merged: Required<EmailTemplate> = {
    subject: template?.subject?.trim() || fallback.subject || "",
    heading: template?.heading?.trim() || fallback.heading || "",
    body: template?.body?.trim() || fallback.body || "",
    signoff: template?.signoff?.trim() || fallback.signoff || "",
  };
  const s = interpolate(merged.subject, vars);
  const h = interpolate(merged.heading, vars);
  const b = interpolate(merged.body, vars);
  const so = interpolate(merged.signoff, vars);
  return { subject: s, html: emailHtml({ heading: h, body: b, signoff: so, footer }) };
}

function interpolate(
  text: string,
  vars: Record<string, string | undefined>,
): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    const v = vars[key];
    return v && v.length > 0 ? v : "";
  });
}

function paragraphs(text: string): string {
  if (!text) return "";
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="font-size: 15px; line-height: 1.6; color: #3D3D3A; margin: 0 0 16px;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

function signoffParagraphs(text: string): string {
  if (!text) return "";
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="font-size: 14px; line-height: 1.55; color: #3D3D3A; margin: 0 0 12px;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

function emailHtml({
  heading,
  body,
  signoff,
  footer,
}: {
  heading: string;
  body: string;
  signoff: string;
  footer?: Footer;
}): string {
  const headingHtml = heading
    ? `<h1 style="font-size: 24px; color: #0A2A6E; margin: 0 0 16px; font-weight: 500;">${escapeHtml(heading)}</h1>`
    : "";
  const bodyHtml = paragraphs(body);
  const signoffHtml = signoff
    ? `<div style="border-top: 1px solid #E6EEFB; padding-top: 16px; margin-top: 24px;">${signoffParagraphs(signoff)}</div>`
    : "";
  const footerHtml =
    footer?.unsubscribeUrl && footer?.unsubscribeLabel
      ? `<hr style="border: none; border-top: 1px solid #E6EEFB; margin: 24px 0;" /><p style="font-size: 12px; color: #6B6B67; line-height: 1.55;"><a href="${footer.unsubscribeUrl}" style="color: #0A2A6E;">${escapeHtml(footer.unsubscribeLabel)}</a></p>`
      : "";
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0A0A0A;">
      ${headingHtml}
      ${bodyHtml}
      ${signoffHtml}
      ${footerHtml}
    </div>
  `;
}

// -----------------------------------------------------------------
// Fallback templates (used when Sanity has no content yet)
// -----------------------------------------------------------------

const DEFAULT_WELCOME: EmailTemplate = {
  subject: "Welcome to HyFy Designs",
  heading: "Welcome to HyFy Designs",
  body: "Thanks for joining the list. Once a month you'll hear from us about new drops, studio picks, and a Houston playlist.",
  signoff: "Talk soon,\nThe HyFy Designs studio\nHouston, TX",
};

const DEFAULT_CONTACT_RESPONSE: EmailTemplate = {
  subject: "Thanks for reaching out",
  heading: "Thanks for reaching out",
  body: "Hi {{name}},\n\nWe got your message and will get back to you within one business day.\n\nIf you have anything to add in the meantime, just reply to this email.",
  signoff: "— The HyFy Designs studio\nHouston, TX",
};

const DEFAULT_QUOTE_RESPONSE: EmailTemplate = {
  subject: "Your quote request is in",
  heading: "Your quote request is in",
  body: "Hi {{name}},\n\nThanks for sending over your project details. We'll review everything and send a detailed quote within 24 hours.\n\nIf you want to add or change anything, just reply to this email.",
  signoff: "— The HyFy Designs studio\nHouston, TX",
};

// -----------------------------------------------------------------
// HTML escaping (used by studio notification renderers too)
// -----------------------------------------------------------------

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
