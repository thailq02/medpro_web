/** @type {import('next').NextConfig} */
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4004",
      },
      {
        protocol: "https",
        hostname: "be.lequangthai-medpro.io.vn",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `@import "./variable.scss";`,
  },
};

export default nextConfig;
