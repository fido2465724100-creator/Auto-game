import type { NextConfig } from 'next';
import path from 'path';

const isExport = process.env.OUTPUT_EXPORT === 'true' || process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/Auto-game' : '');

const exportConfig: Partial<NextConfig> = {};
if (isExport) {
  exportConfig.output = 'export';
  exportConfig.images = { unoptimized: true };
  if (basePath) {
    exportConfig.basePath = basePath;
    exportConfig.assetPrefix = `${basePath}/`;
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ['@ait/shared-types', '@ait/game-engine'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  ...exportConfig,
  ...(!isExport
    ? {
        async rewrites() {
          return [
            {
              source: '/game/:path*',
              destination: 'http://localhost:4000/game/:path*',
            },
          ];
        },
      }
    : {}),
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
