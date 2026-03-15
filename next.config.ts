import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/song-guess" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/song-guess/" : "",
};

export default nextConfig;
