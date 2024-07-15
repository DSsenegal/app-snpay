import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import { SyntheticEvent, useEffect, useState } from "react";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsApiResponse, SettingsUpdateApiRequest } from "../api/settings";
import Link from "next/link";

const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [config, setConfig] = useState<SettingsUpdateApiRequest | null>(null);

  // Transition state is used to visualize submit button state and block form when requests are in-flight
  // const [transitionState, setTransitionState] = useState<ConfirmButtonTransitionState>("loading");

  const addConfiguration = (event: SyntheticEvent) => {
    event.preventDefault();
    // setTransitionState("loading");

    const apiKey = new FormData(event.currentTarget as HTMLFormElement).get("api-key") as string;
    const marchantUrl = new FormData(event.currentTarget as HTMLFormElement).get(
      "webhook-url"
    ) as string;

    const newSettings: SettingsUpdateApiRequest = { apiKey, marchantUrl };

    fetch("/api/settings", {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
      body: JSON.stringify(newSettings),
    })
      .then(async (response) => {
        if (response.status === 200) {
          // setTransitionState("success");
          const { data } = (await response.json()) as SettingsApiResponse;
          if (data?.apiKey && data.marchantUrl) {
            setConfig(data);
          }

          // Use the dashboard notification system to show status of the operation
          appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "success",
              title: "Success",
              text: "Settings updated successfully",
              actionId: "submit-success",
            },
          });
        } else {
          // setTransitionState("error");
          appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "error",
              title: "Error",
              text: `Updating the settings unsuccessful. The API responded with status ${response.status}`,
              actionId: "submit-success",
            },
          });
        }
      })
      .catch(async () => {
        // setTransitionState("error");
        appBridge?.dispatch({
          type: "notification",
          payload: {
            status: "error",
            title: "Configuration update failed",
            actionId: "submit-error",
          },
        });
      });
  };

  return (
    <Box padding={8} gap={10} display={"grid"}>
      {/* App brand */}
      <Box>
        <Text size={10} fontWeight={"bold"}>
          <Link href={"/"}>Senpay</Link> / Add Configuration
        </Text>
      </Box>

      {/* Api configurations */}
      {appBridgeState?.ready && (
        <Box display={"flex"} gap={16} justifyContent={"space-between"}>
          <Box style={{ width: "40%" }}>
            <Text size={8} fontWeight={"bold"}>
              Senpay configurations
            </Text>
            <Text whiteSpace={"nowrap"} size={4} as={"p"} marginY={4}>
              Add dexchange api token and callback urls
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
            paddingY={3}
            borderWidth={1}
            as={"form"}
            onSubmit={addConfiguration}
          >
            <Input
              label="API Key"
              defaultValue={config?.apiKey || ""}
              size="small"
              required
              helperText="API Key used for dexchange API calls"
              name="api-key"
            />

            <Input
              label="Webhook Url"
              defaultValue={config?.marchantUrl || ""}
              size="small"
              required
              name="webhook-url"
            />
            <Button paddingY={4} size="large" fontSize={4} fontWeight={"bold"} type="submit">
              Save configurations
            </Button>
          </Box>
        </Box>
      )}
      {/* origin add */}
      <Box as={"form"} display={"flex"} gap={16} justifyContent={"space-between"}>
        <Box style={{ width: "40%" }}>
          <Text size={8} fontWeight={"bold"}>
            Allowed origins
          </Text>
          <Text size={4} as={"p"} marginY={4}>
            Those are domains from which Adyen expects to get your client-side requests. You have to
            provide a URL to your deployed checkout. Add dexchange api token and callback urls
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
          paddingY={3}
          borderWidth={1}
        >
          <Box
            display={"flex"}
            gap={4}
            alignItems={"center"}
            width={"100%"}
            onSubmit={(event) => {
              event.preventDefault();

              const origin = new FormData(event.currentTarget as HTMLFormElement).get("origin");

              console.log(origin);
            }}
          >
            <Input
              label="Origin"
              size="small"
              width={"100%"}
              name="origin"
              backgroundColor={"default1"}
              helperText="Add new allowed origin"
            />
            <Button type="submit" width={32}>
              + Add origin
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IndexPage;
