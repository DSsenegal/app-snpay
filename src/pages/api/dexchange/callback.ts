import { updateTransaction } from "@/services/update-transaction";
import { CallbackPayload } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { OrderDetailsQuery } from "../../../../generated/graphql";
import { saleorApp } from "@/saleor-app";
import { createClient } from "@/lib/create-graphq-client";

export default async function SenpayWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  } else {
    const transaction = req.body as CallbackPayload;
    const payload = JSON.parse(transaction.CUSTOM_DATA) as OrderDetailsQuery & {
      saleorDomain: string;
    };
    const authData = await saleorApp.apl.get(`https://${payload?.saleorDomain}/graphql/`);

    if (!authData) {
      res.status(500).json({ error: "Error fetching auth data" });
      return;
    }
    const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

    if (transaction.STATUS === "SUCCESS") {
      console.log("Transaction was successful");

      try {
        const transaction = await updateTransaction(
          {
            transactionId: payload.order?.transactions[0].id,
            amount: payload.order?.total.gross.amount,
            currency: payload.order?.total.gross.currency,
            externalUrl: `${process.env.APP_IFRAME_BASE_URL}/checkout/${payload.order?.id}`,
            pspReference: "psp" + payload.order?.transactions[0].pspReference,
            pspReferenceEvent: "psp" + payload.order?.transactions[0].pspReference + ".charge",
          },
          client
        );

        console.log(transaction);
      } catch (error) {
        console.error("Error creating transaction", error);
      }
    }

    res.status(200).json(transaction);
  }
}
