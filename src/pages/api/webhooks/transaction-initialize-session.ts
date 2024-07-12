import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  TransactionInitializeSessionEventFragment,
  UntypedTransactionInitializeSessionDocument,
} from "../../../../generated/graphql";
import { saleorApp } from "@/saleor-app";

export const transactionInitializeSessionSyncWebhook =
  new SaleorSyncWebhook<TransactionInitializeSessionEventFragment>({
    name: "TransactionInitializeSession",
    apl: saleorApp.apl,
    event: "TRANSACTION_INITIALIZE_SESSION",
    query: UntypedTransactionInitializeSessionDocument,
    webhookPath: "/api/webhooks/transaction-initialize-session",
  });

export default transactionInitializeSessionSyncWebhook.createHandler((req, res, ctx) => {
  const { event } = req.body;
  console.log("TransactionInitializeSession", event);
});
