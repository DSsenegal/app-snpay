import { OrderDetailsQuery } from "../../generated/graphql";

export const createPaymentLink = async (
  data: OrderDetailsQuery,
  apiKey: string,
  saleorDomain: string
) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      externalTransactionId: data?.order?.id + Date.now().toString(),
      ItemName: "Senpay Payment",
      //   ItemPrice: data?.order?.total.gross.amount,
      ItemPrice: 150,
      customData: JSON.stringify({ order: data?.order, saleorDomain }),
      callBackURL: `${process.env.APP_IFRAME_BASE_URL}/api/dexchange/callback`,
      successUrl: `${process.env.APP_IFRAME_BASE_URL}/payment-success`,
      failureUrl: `${process.env.APP_IFRAME_BASE_URL}/payment-failure`,
    }),
  };

  const marchantUrl = process.env.DEXCHANGE_MARCHANT_LINK as string;
  const response = await fetch(marchantUrl, options);
  const responseData = await response.json();

  return responseData.transaction.PaymentUrl;
};
