import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Output standalone to allow deployment flexibility
  output: "standalone",

  // Disable ISR fallback to prevent oversized fallback files
  staticPageGenerationTimeout: 60, // Increase build timeout for large pages if needed
};

export default nextConfig;
