// Browser-side PayPal JS SDK loader. Minimal hand-written types for just
// the surface we use — there's no reliable first-party @types package for
// the window.paypal global SDK, and after the trouble we had with a
// community-maintained @types package lagging the real Braintree runtime,
// a small local type for exactly what we call is safer than reaching for
// another one of unknown accuracy.

export type PaypalOrderData = { orderID: string };

export type PaypalButtonsConfig = {
  style?: { layout?: "vertical" | "horizontal"; shape?: "rect" | "pill" };
  createOrder: () => Promise<string>;
  onApprove: (data: PaypalOrderData) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
};

export type PaypalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close: () => Promise<void>;
};

export type PaypalNamespace = {
  Buttons: (config: PaypalButtonsConfig) => PaypalButtonsInstance;
};

declare global {
  interface Window {
    paypal?: PaypalNamespace;
  }
}

let scriptPromise: Promise<PaypalNamespace> | null = null;

export function loadPaypalScript(clientId: string): Promise<PaypalNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadPaypalScript called on the server"));
  }
  if (window.paypal) {
    return Promise.resolve(window.paypal);
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-paypal-sdk]",
    );
    const onLoad = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error("PayPal SDK loaded but window.paypal is missing."));
      }
    };

    if (existing) {
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load the PayPal SDK.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`;
    script.dataset.paypalSdk = "true";
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load the PayPal SDK.")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return scriptPromise;
}
