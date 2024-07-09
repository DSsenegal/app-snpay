import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";

const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.APP_IFRAME_BASE_URL}/api/data/payment-api`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.error) setConfig(data.message);
      });

    setMounted(true);
  }, []);

  return (
    <Box padding={8} gap={10} display={"grid"}>
      <Box>
        <Text size={8} fontWeight={"bold"}>
          Senpay
        </Text>
      </Box>

      {/* Api configurations */}
      <Box display={"flex"} gap={16} justifyContent={"space-between"}>
        <Box width={52}>
          <Text size={5} fontWeight={"bold"}>
            Senpay configurations
          </Text>
          <Text whiteSpace={"nowrap"} size={2} as={"p"} marginY={4}>
            Add dexchange api token and callback urls
          </Text>
        </Box>
        <Box
          width={"100%"}
          display={"grid"}
          gap={6}
          borderStyle={"solid"}
          borderColor={"default1"}
          borderRadius={5}
          paddingX={4}
          paddingY={3}
          borderWidth={1}
        >
          {mounted && config?.isSet && <Text>{JSON.stringify(config, null, 2)}</Text>}
          {appBridgeState?.ready && mounted && !config?.isSet && (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingY={16}>
              <Link href="/configurations/add">
                <Button variant="secondary">Add configurations</Button>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default IndexPage;
