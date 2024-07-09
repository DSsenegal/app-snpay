import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <Box padding={8} gap={10} display={"grid"}>
      {/* App brand */}
      <Box>
        <Text size={8} fontWeight={"bold"}>
          Senpay / Add Configuration
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
          as={"form"}
          onSubmit={(event) => {
            event.preventDefault();

            const apiKey = new FormData(event.currentTarget as HTMLFormElement).get("api-key");
            const webhookUrl = new FormData(event.currentTarget as HTMLFormElement).get(
              "webhook-url"
            );

            fetch(`${process.env.APP_IFRAME_BASE_URL}/api/data/payment-api`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                apiKey,
                webhookUrl,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log(data));
          }}
        >
          <Input
            label="API Key"
            size="small"
            required
            helperText="API Key used for dexchange API calls"
            name="api-key"
          />

          <Input label="Webhook Url" size="small" required name="webhook-url" />
          <Button type="submit">Save</Button>
        </Box>
      </Box>

      {/* origin add */}
      <Box as={"form"} display={"flex"} gap={16} justifyContent={"space-between"}>
        <Box>
          <Text size={5} fontWeight={"bold"}>
            Allowed origins
          </Text>
          <Text width={52} size={2} as={"p"} marginY={4}>
            Those are domains from which Adyen expects to get your client-side requests. You have to
            provide a URL to your deployed checkout. Add dexchange api token and callback urls
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
