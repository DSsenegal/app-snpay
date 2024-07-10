import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { type PageConfig } from "next";
import { saleorApp } from "@/saleor-app";
import {
  PaymentGatewayInitializeSessionEventFragment,
  UntypedPaymentGatewayInitializeSessionDocument,
} from "@/../generated/graphql";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export const paymentGatewayInitializeSessionSyncWebhook =
  new SaleorSyncWebhook<PaymentGatewayInitializeSessionEventFragment>({
    name: "PaymentGatewayInitializeSession",
    apl: saleorApp.apl,
    event: "PAYMENT_GATEWAY_INITIALIZE_SESSION",
    query: UntypedPaymentGatewayInitializeSessionDocument,
    webhookPath: "api/webhooks/payment-gateway-initialize-session",
  });

export default paymentGatewayInitializeSessionSyncWebhook.createHandler((req, res, ctx) => {
  const { payload, event, baseUrl, authData } = ctx;

  console.log(payload, event, baseUrl, authData);

  const paymentMethods = [
    {
      id: "senpay.saleor.app",
      name: "Senpay",
      currencies: ["USD", "EUR", "XOF"],
      config: {
        // Configuration details for your payment method
      },
    },
  ];

  // Respond with the payment methods
  res.status(200).json({ payment_methods: paymentMethods });
});
