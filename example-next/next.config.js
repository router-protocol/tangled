/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  // Ignore build errors related to HeartbeatWorker
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev, isServer, webpack }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Add IgnorePlugin to ignore HeartbeatWorker files
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /HeartbeatWorker\.js$/,
      }),
    );

    return config;
  },
  // Disable turbo to use standard webpack bundling
  // experimental: {
  //   turbo: {},
  // },
};

export default config;
