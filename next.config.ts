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
      // the assistant pages were retired with the rebuild
      { source: "/assistant", destination: "/platform/features", permanent: false },
      { source: "/platform/assistant", destination: "/platform/features", permanent: false },
      // routes removed by the open-source pivot, kept alive for old links and
      // search hits. Temporary rather than permanent so they can be re-pointed.
      { source: "/nova", destination: "/platform/features", permanent: false },
      { source: "/platform/nova", destination: "/platform/features", permanent: false },
      { source: "/hackathons", destination: "/opensource", permanent: false },
      { source: "/hackathons/:id", destination: "/opensource", permanent: false },
      { source: "/resources", destination: "/projects", permanent: false },
      { source: "/resources/:id", destination: "/projects", permanent: false },
      { source: "/apis", destination: "/projects", permanent: false },
      { source: "/tools", destination: "/projects", permanent: false },
      { source: "/tools/:path*", destination: "/projects", permanent: false },
      { source: "/dashboard/saved", destination: "/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
