import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root },
  async redirects() {
    return [
      // close the bare-route dead end: /platform lands on Features
      { source: "/platform", destination: "/platform/features", permanent: false },
      // one AI for the platform: the old helper pages now live inside Co-pilot
      { source: "/assistant", destination: "/nova", permanent: false },
      { source: "/platform/assistant", destination: "/nova", permanent: false },
    ];
  },
};

export default nextConfig;
