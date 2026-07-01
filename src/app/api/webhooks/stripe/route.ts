import { NextResponse } from "next/server";
import { createOrder } from "@/lib/printful";

export async function POST(req: Request) {
  // Real handler needs signature verification with STRIPE_WEBHOOK_SECRET.
  // This stub shows the shape: on checkout.session.completed, forward to Printful.
  const payload = (await req.json()) as {
    type: string;
    data: {
      object: {
        customer_email: string;
        line_items?: { variantId: string; quantity: number }[];
        shipping_details?: {
          name: string;
          address: {
            line1: string;
            city: string;
            state: string;
            postal_code: string;
            country: string;
          };
        };
      };
    };
  };

  if (payload.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = payload.data.object;
  if (!session.line_items || !session.shipping_details) {
    return NextResponse.json({ received: true });
  }

  await createOrder({
    email: session.customer_email,
    items: session.line_items,
    shipping: {
      name: session.shipping_details.name,
      address1: session.shipping_details.address.line1,
      city: session.shipping_details.address.city,
      state: session.shipping_details.address.state,
      zip: session.shipping_details.address.postal_code,
      country: session.shipping_details.address.country,
    },
  });

  return NextResponse.json({ received: true });
}
