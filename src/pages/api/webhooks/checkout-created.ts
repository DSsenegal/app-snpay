import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  CheckoutCreatedWebhookPayloadFragment,
  UntypedCheckoutCreatedDocument,
} from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";
import { createClient } from "../../../lib/create-graphq-client";
import { createOrderFromCheckout } from "@/services/create-order-from-checkout";

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderCreatedWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const checkoutCreatedWebhook = new SaleorAsyncWebhook<CheckoutCreatedWebhookPayloadFragment>(
  {
    name: "Checkout Created",
    webhookPath: "/api/webhooks/checkout-created",
    event: "CHECKOUT_CREATED",
    apl: saleorApp.apl,
    query: UntypedCheckoutCreatedDocument,
  }
);

/**
 * Export decorated Next.js handler, which adds extra context
 */
export default checkoutCreatedWebhook.createHandler(async (req, res, ctx) => {
  const {
    /**
     * Access payload from Saleor - defined above
     */
    payload,
    /**
     * Saleor event that triggers the webhook (here - ORDER_CREATED)
     */
    event,
    /**
     * App's URL
     */
    baseUrl,
    /**
     * Auth data (from APL) - contains token and saleorApiUrl that can be used to construct graphQL client
     */
    authData,
  } = ctx;

  /**
   * Perform logic based on Saleor Event payload
   */
  console.log(`Checkout was created ID: ${payload.checkout?.id}`);

  /**
   * Create GraphQL client to interact with Saleor API.
   */
  const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

  try {
    const order = await createOrderFromCheckout(payload.checkout?.id as string, client);

    console.log(order);
  } catch (error) {
    console.error("Error creating checkout", error);
  }
  /**
   * Now you can fetch additional data using urql.
   * https://formidable.com/open-source/urql/docs/api/core/#clientquery
   */

  // const data = await client.query().toPromise()

  /**
   * Inform Saleor that webhook was delivered properly.
   */
  return res.status(200).end();
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
