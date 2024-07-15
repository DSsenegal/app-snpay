import { CallbackPayload } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

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

    if (transaction.STATUS === "SUCCESS") {
      console.log("Transaction was successful");
    }

    res.status(200).json(transaction);
  }
}
