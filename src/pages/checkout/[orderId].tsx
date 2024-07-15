import { Box, Button } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrderDetailsQuery, UntypedOrderDetailsDocument } from "../../../generated/graphql";
import { saleorApp } from "@/saleor-app";
import { createClient } from "@/lib/create-graphq-client";
import { createPaymentLink } from "@/services/create-payment-link";
import { createSettingsManager } from "@/lib/metadata";

export default function Page({ paymentUrl }: { paymentUrl: string }) {
  const router = useRouter();

  return (
    <Box margin={16}>
      <h1>Payment link</h1>
      <p>Click the button below to go to the payment page</p>
      <p>Payment URL: {paymentUrl}</p>
      <Button onClick={() => router.push(paymentUrl)}>Go to payment</Button>
    </Box>
  );
}

export async function getServerSideProps(ctx: any) {
  const orderId = ctx.params.orderId;
  const saleorDomain = ctx.query.saleorDomain;
  const authData = await saleorApp.apl.get(`https://${saleorDomain}/graphql/`);

  if (!authData || !orderId) {
    return {
      props: {
        data: null,
      },
    };
  }

  const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

  const { data, error } = await client
    .query<OrderDetailsQuery, any>(UntypedOrderDetailsDocument, {
      id: orderId,
    })
    .toPromise();

  if (error) {
    console.error("Error fetching order details", error);
  }

  if (!data) {
    return {
      props: {
        data: null,
      },
    };
  }

  const settings = createSettingsManager(client);
  const apiKey = (await settings.get("apiKey", authData.domain)) as string;

  const paymentUrl = await createPaymentLink(data, apiKey, authData.domain as string);

  return {
    props: {
      paymentUrl,
    },
  };
}
