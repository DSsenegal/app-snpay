import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import { SettingsApiResponse } from "./api/settings";
import { error } from "console";

const AddToSaleorForm = () => (
  <Box
    as={"form"}
    display={"flex"}
    alignItems={"center"}
    gap={4}
    onSubmit={(event) => {
      event.preventDefault();

      const saleorUrl = new FormData(event.currentTarget as HTMLFormElement).get("saleor-url");
      const manifestUrl = new URL("/api/manifest", window.location.origin);
      const redirectUrl = new URL(
        `/dashboard/apps/install?manifestUrl=${manifestUrl}`,
        saleorUrl as string
      ).href;

      window.open(redirectUrl, "_blank");
    }}
  >
    <Input type="url" required label="Saleor URL" name="saleor-url" />
    <Button type="submit">Add to Saleor</Button>
  </Box>
);

/**
 * This is page publicly accessible from your app.
 * You should probably remove it.
 */
const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<SettingsApiResponse | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/settings", {
      method: "GET",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
    })
      .then(async (response) => {
        const { data } = (await response.json()) as SettingsApiResponse;
        if (data?.apiKey && data?.marchantUrl) {
          setConfig(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [appBridgeState?.token, appBridgeState?.domain]);

  return (
    <Box padding={8} gap={10} display={"grid"}>
      <Box>
        <Text size={10} fontWeight={"bold"}>
          Senpay
        </Text>
      </Box>

      {/* Api configurations */}
      <Box display={"flex"} gap={16} justifyContent={"space-between"}>
        <Box style={{ width: "40%" }}>
          <Text size={8} fontWeight={"bold"}>
            Senpay configurations
          </Text>
          <Text whiteSpace={"nowrap"} size={4} as={"p"} marginY={4}>
            Add dexchange api token and marchant url
          </Text>
        </Box>
        <Box
          style={{ width: "60%" }}
          display={"grid"}
          gap={6}
          borderStyle={"solid"}
          borderColor={"default1"}
          borderRadius={5}
          paddingX={4}
          paddingY={16}
          borderWidth={1}
        >
          {mounted && config && (
            <Box display={"grid"} gap={4} marginX={4}>
              <Text size={6} fontWeight={"bold"} marginX={"auto"} color={"info1"} marginBottom={0}>
                Configurations added
              </Text>
              <Box>
                <Text size={6} fontWeight={"bold"} marginRight={2}>
                  API KEY :
                </Text>
                <Text size={4}>{config.apiKey}</Text>
              </Box>
              <Box>
                <Text size={6} fontWeight={"bold"} marginRight={2}>
                  Marchant URL :
                </Text>
                <Text size={4}>{config.marchantUrl}</Text>
              </Box>
            </Box>
          )}
          {loading && (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingY={4}>
              <Text>Loading configurations...</Text>
            </Box>
          )}

          {appBridgeState?.ready && mounted && (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingY={4}>
              <Link href="/configurations/add">
                <Button variant="secondary">Set configurations</Button>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default IndexPage;
