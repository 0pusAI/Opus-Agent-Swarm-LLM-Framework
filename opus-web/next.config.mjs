/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js + R3F sometimes need transpilation when imported from node_modules.
  transpilePackages: ["three"],
  experimental: {
    // Lower SSR jitter on the Three.js scene.
    optimizePackageImports: ["@react-three/drei", "@react-three/fiber"],
  },
};

export default nextConfig;
