// Server-only PayPal REST API client. Do not import from client components.
//
// Plain fetch() against PayPal's Orders v2 API rather than a wrapper
// package — the SDK ecosystem around PayPal churns (deprecated packages,
// community @types that lag the real API), and this API surface is small
// enough (an OAuth2 token endpoint plus two JSON calls) that hand-rolling
// it is more transparent and maintainable than debugging someone else's
// abstraction later.

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

export const hasPaypal = Boolean(clientId && clientSecret);

const baseUrl =
  process.env.PAYPAL_ENVIRONMENT === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured.");
  }
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal OAuth token request failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  // Refresh a little early to avoid racing expiry mid-request.
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

async function paypalFetch<T>(
  path: string,
  init: { method: string; body?: unknown },
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const message =
      (data && (data.message || data.error_description)) ||
      `PayPal API request failed: ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export type PaypalOrder = {
  id: string;
  status: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ id: string; status: string }>;
    };
  }>;
  payer?: {
    email_address?: string;
  };
};

export async function createPaypalOrder(params: {
  amount: string;
  currency?: string;
  items: Array<{ name: string; quantity: string; unitAmount: string }>;
  itemTotal: string;
  shippingTotal: string;
  shippingAddress?: {
    name: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}): Promise<PaypalOrder> {
  const currency = params.currency ?? "USD";

  return paypalFetch<PaypalOrder>("/v2/checkout/orders", {
    method: "POST",
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: params.amount,
            breakdown: {
              item_total: { currency_code: currency, value: params.itemTotal },
              shipping: { currency_code: currency, value: params.shippingTotal },
            },
          },
          items: params.items.map((item) => ({
            name: item.name.slice(0, 127),
            quantity: item.quantity,
            unit_amount: { currency_code: currency, value: item.unitAmount },
          })),
          ...(params.shippingAddress
            ? {
                shipping: {
                  name: { full_name: params.shippingAddress.name },
                  address: {
                    address_line_1: params.shippingAddress.address1,
                    admin_area_2: params.shippingAddress.city,
                    admin_area_1: params.shippingAddress.state,
                    postal_code: params.shippingAddress.zip,
                    country_code: params.shippingAddress.country,
                  },
                },
              }
            : {}),
        },
      ],
    },
  });
}

export async function capturePaypalOrder(orderId: string): Promise<PaypalOrder> {
  return paypalFetch<PaypalOrder>(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
  });
}
