import { NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/lib/email";

async function handle(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const token = (url.searchParams.get("token") ?? "").trim();
  const result = await unsubscribeFromNewsletter(email, token);
  return result;
}

export async function POST(req: Request) {
  // One-click unsubscribe from email clients (List-Unsubscribe-Post header).
  const result = await handle(req);
  if (!result.ok) {
    return new NextResponse(null, {
      status: result.reason === "invalid" ? 400 : 500,
    });
  }
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: Request) {
  // Direct browser click from an email body — bounce to the confirmation
  // page so the user always sees a result. The page performs the actual
  // update on the server, so we only forward the token here.
  const url = new URL(req.url);
  return NextResponse.redirect(
    new URL(`/unsubscribe?${url.searchParams.toString()}`, req.url),
  );
}
