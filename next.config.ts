// next.config.ts

import { NextConfig } from "next";

// Import i18n configuration from next-i18next.config.js
const { i18n } = require('./next-i18next.config');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n,  // Adding the i18n configuration here
  // You can add other custom Next.js config options here
  crossOrigin: 'anonymous',

};

export default nextConfig;
