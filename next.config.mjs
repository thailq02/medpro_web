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
        hostname: "be.lequangthai-medpro.io.vn",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `@import "./variable.scss";`,
  },
};

export default nextConfig;
