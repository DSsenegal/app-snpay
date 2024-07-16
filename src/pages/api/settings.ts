import type { NextApiRequest, NextApiResponse } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";

import { createSettingsManager } from "../../lib/metadata";
import { saleorApp } from "@/saleor-app";
import { createClient } from "@/lib/create-graphq-client";

// Interfaces below are shared with the client part to ensure we use the same
// shape of the data for communication. It's completely optional, but makes
// refactoring much easier.
export interface SettingsUpdateApiRequest {
  apiKey: string;
  marchantUrl: string;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: {
    apiKey: string;
    marchantUrl: string;
  };
}

// If your app store secrets like API keys, it is a good practice to not send
// them to client application if thats not required.
// Obfuscate function will hide secret value with dots, leaving only last 4 and first 4
// characters which should be enough for the user to know if thats a right value.
const obfuscateSecret = (secret: string) => {
  if (!secret) {
    return "";
  }
  return `${secret.slice(0, 6)}${"*".repeat(14)}${secret.slice(-6)}`;
};

// Helper function to minimize duplication and keep the same response structure.
// Even multiple calls of `get` method will result with only one call to the database.
const sendResponse = async (
  res: NextApiResponse<SettingsApiResponse>,
  statusCode: number,
  settings: SettingsManager,
  domain: string
) => {
  res.status(statusCode).json({
    success: statusCode === 200,
    data: {
      marchantUrl: (await settings.get("marchantUrl")) || "",
      apiKey: obfuscateSecret((await settings.get("apiKey", domain)) as string) || "",
    },
  });
};

// Main body of our settings endpoint. It's available at `api/settings` url.
// Using GET method will return existing values, and POST is used to modify them.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsApiResponse>
) {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(`https://${saleorDomain}/graphql/`);

  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).json({ success: false });
    return;
  }

  // To make queries to Saleor API we need urql client
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  // Helper located at `src/lib/metadata.ts` returns manager which will be used to
  // get or modify metadata.
  const settings = createSettingsManager(client);

  if (req.method === "GET") {
    await sendResponse(res, 200, settings, saleorDomain);
    return;
  } else if (req.method === "POST") {
    const { apiKey, marchantUrl } = req.body as SettingsUpdateApiRequest;

    if (apiKey && marchantUrl) {
      // You can set metadata one by one, but passing array of the values
      // will spare additional roundtrips to the Saleor API.
      // After mutation is made, internal cache of the manager
      // will be automatically updated
      await settings.set([
        { key: "marchantUrl", value: marchantUrl },
        { key: "apiKey", value: apiKey, domain: saleorDomain },
      ]);
      await sendResponse(res, 200, settings, saleorDomain);
      return;
    } else {
      console.log("Missing Settings Values");
      await sendResponse(res, 400, settings, saleorDomain);
      return;
    }
  }
  res.status(405).end();
  return;
}
