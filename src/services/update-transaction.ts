import {
  TransactionUpdateMutation,
  UntypedTransactionUpdateDocument,
} from "@/../generated/graphql";
import { Client } from "urql";
import { updateTransactionInput } from "@/types";

export async function updateTransaction(transactionInput: updateTransactionInput, client: Client) {
  const { transactionId, amount, externalUrl, pspReference, pspReferenceEvent, currency } =
    transactionInput;

  const { data, error } = await client
    .mutation<TransactionUpdateMutation, any>(UntypedTransactionUpdateDocument, {
      transactionId,
      amount,
      currency,
      externalUrl,
      pspReference,
      pspReferenceEvent,
    })
    .toPromise();

  return { error, transaction: data?.transactionUpdate?.transaction };
}
