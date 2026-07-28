// Server-side check paired with components/forms/spam-guard-fields.tsx.
// Call this immediately after parsing form data, before validating real
// fields or sending any email — bots that trip either signal should get
// a fake success response, not a validation error that teaches them
// what to fix.
const MIN_ELAPSED_MS = 1500;

export function isLikelyBot(form: FormData): boolean {
  const honeypot = String(form.get("company") ?? "").trim();
  if (honeypot.length > 0) return true;

  const renderedAt = Number(form.get("form_rendered_at") ?? NaN);
  if (!renderedAt || Number.isNaN(renderedAt)) return true;

  const elapsed = Date.now() - renderedAt;
  if (elapsed < MIN_ELAPSED_MS) return true;

  return false;
}
