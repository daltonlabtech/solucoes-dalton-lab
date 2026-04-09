// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'instagram-data-production.up.railway.app' },
    ],
  },
}

export default nextConfig
