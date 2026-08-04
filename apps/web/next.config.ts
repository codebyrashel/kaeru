import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "pg"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;