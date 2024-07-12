/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    APP_GRAPHQL_URL: process.env.APP_GRAPHQL_URL,
    DEXCHANGE_MARCHANT_LINK: process.env.DEXCHANGE_MARCHANT_LINK,
    DEXCHANGE_API_TOKEN: process.env.DEXCHANGE_API_TOKEN,
  },
};
