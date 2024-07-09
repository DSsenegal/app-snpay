/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    APP_IFRAME_BASE_URL: process.env.APP_IFRAME_BASE_URL,
  },
};
