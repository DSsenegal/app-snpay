import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { orderCreatedWebhook } from "./webhooks/order-created";
import { paymentGatewayInitializeSessionSyncWebhook } from "./webhooks/payment-gateway-initialize-session";
import { transactionInitializeSessionSyncWebhook } from "./webhooks/transaction-initialize-session";
import { checkoutCreatedWebhook } from "./webhooks/checkout-created";

/**
 * App SDK helps with the valid Saleor App Manifest creation. Read more:
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/api-handlers.md#manifest-handler-factory
 */
export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request }) {
    /**
     * Allow to overwrite default app base url, to enable Docker support.
     *
     * See docs: https://docs.saleor.io/docs/3.x/developer/extending/apps/local-app-development
     */
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    const manifest: AppManifest = {
      name: "Senpay",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,
      /**
       * Set permissions for app if needed
       * https://docs.saleor.io/docs/3.x/developer/permissions
       */
      permissions: [
        /**
         * Add permission to allow "ORDER_CREATED" webhook registration.
         *
         * This can be removed
         */
        "MANAGE_ORDERS",
        "MANAGE_CHECKOUTS",
        "HANDLE_CHECKOUTS",
        "HANDLE_PAYMENTS",
      ],
      id: "senpay.saleor.app",
      version: packageJson.version,
      /**
       * Configure webhooks here. They will be created in Saleor during installation
       * Read more
       * https://docs.saleor.io/docs/3.x/developer/api-reference/webhooks/objects/webhook
       *
       * Easiest way to create webhook is to use app-sdk
       * https://github.com/saleor/saleor-app-sdk/blob/main/docs/saleor-webhook.md
       */
      webhooks: [
        orderCreatedWebhook.getWebhookManifest(apiBaseURL),
        checkoutCreatedWebhook.getWebhookManifest(apiBaseURL),
        paymentGatewayInitializeSessionSyncWebhook.getWebhookManifest(apiBaseURL),
        transactionInitializeSessionSyncWebhook.getWebhookManifest(apiBaseURL),
      ],
      /**
       * Optionally, extend Dashboard with custom UIs
       * https://docs.saleor.io/docs/3.x/developer/extending/apps/extending-dashboard-with-apps
       */
      extensions: [],
      author: "DSsenegal",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
