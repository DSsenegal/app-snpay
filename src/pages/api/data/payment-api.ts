import type { NextApiRequest, NextApiResponse } from "next";

let userConfig = {
  apiKey: "",
  webhookUrl: "",
  isSet: false,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { apiKey, webhookUrl } = req.body;
    if (apiKey && webhookUrl) {
      userConfig.apiKey = apiKey;
      userConfig.webhookUrl = webhookUrl;
      userConfig.isSet = true;
    }

    return res.status(200).json({ error: null, message: userConfig });
  } else {
    return res.status(200).json({ error: null, message: userConfig });
  }
}
