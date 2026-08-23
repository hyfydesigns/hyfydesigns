// Server-only Braintree client. Do not import from client components.
import braintree from "braintree";

const merchantId = process.env.BRAINTREE_MERCHANT_ID;
const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

const environment =
  process.env.BRAINTREE_ENVIRONMENT === "production"
    ? braintree.Environment.Production
    : braintree.Environment.Sandbox;

export const gateway =
  merchantId && publicKey && privateKey
    ? new braintree.BraintreeGateway({
        environment,
        merchantId,
        publicKey,
        privateKey,
      })
    : null;

export const hasBraintree = Boolean(gateway);
