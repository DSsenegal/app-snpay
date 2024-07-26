import { NextApiRequest, NextApiResponse } from "next";
import { saleorApp } from "@/saleor-app";
import { createClient } from "@/lib/create-graphq-client";
import { createOrderFromCheckout } from "@/services/create-order-from-checkout";
import { createTransaction } from "@/services/create-transaction";

export default async function SenpayWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  } else {
    const payload = req.body as { checkoutId: string; saleorDomain: string };
    const authData = await saleorApp.apl.get(`https://${payload?.saleorDomain}/graphql/`);

    if (!authData) {
      res.status(500).json({ error: "Error fetching auth data" });
      return;
    }

    const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

    try {
      const orderCreated = await createOrderFromCheckout(payload.checkoutId as string, client);

      const transaction = await createTransaction(
        {
          orderId: orderCreated.order?.id,
          amount: orderCreated.order?.total.gross.amount,
          currency: orderCreated.order?.total.gross.currency,
          externalUrl: `${process.env.APP_IFRAME_BASE_URL}/checkout/${orderCreated.order?.id}?saleorDomain=${authData.domain}`,
          pspReference: "psp" + orderCreated.order?.id,
        },
        client
      );

      console.log(transaction);

      return res.status(200).json({ paymentUrl: transaction.transaction?.externalUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error creating order or transaction" });
    }
  }
}
