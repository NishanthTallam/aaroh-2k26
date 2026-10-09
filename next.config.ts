import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.storage.c-7.us-east-2.aws.neon.tech",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "br-floral-butterfly-b5vu6k0t.storage.c-7.us-east-2.aws.neon.tech",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
