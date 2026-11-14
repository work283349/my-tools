import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 允許同一個 Wi-Fi 下的裝置（手機、平板）用區網 IP 連到開發伺服器；
  // 若電腦的 IP 變了，記得改這裡並重啟 npm run dev
  allowedDevOrigins: ["192.168.1.168"],
  cacheComponents: true,
  partialPrefetching: true,
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
