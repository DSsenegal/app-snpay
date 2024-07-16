import {
  OrderCreateFromCheckoutMutation,
  UntypedOrderCreateFromCheckoutDocument,
} from "@/../generated/graphql";
import { Client } from "urql";

export async function createOrderFromCheckout(checkoutId: string, client: Client) {
  const { data, error } = await client
    .mutation<OrderCreateFromCheckoutMutation, any>(UntypedOrderCreateFromCheckoutDocument, {
      id: checkoutId,
    })
    .toPromise();

  return { error, order: data?.orderCreateFromCheckout?.order };
}
