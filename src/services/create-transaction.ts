import {
  TransactionCreateMutation,
  UntypedTransactionCreateDocument,
} from "@/../generated/graphql";
import { Client } from "urql";
import { createTransactionInput } from "../types";

export async function createTransaction(transactionInput: createTransactionInput, client: Client) {
  const { orderId, amount, externalUrl, pspReference, currency } = transactionInput;

  const { data, error } = await client
    .mutation<TransactionCreateMutation, any>(UntypedTransactionCreateDocument, {
      orderId,
      amount,
      currency,
      availableActions: ["CANCEL", "CHARGE"],
      externalUrl,
      message: "Authorized",
      pspReference,
    })
    .toPromise();

  return { error, transaction: data?.transactionCreate?.transaction };
}
