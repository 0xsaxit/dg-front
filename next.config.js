// analyze the code bundles that are generated with Next.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const path = require('path');

module.exports = {
  productionBrowserSourceMaps: process.env.APP_ENV !== 'production' ? true : false, // enables debugging for non production mode
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV
  },
  webpack: (config, { isServer }) => {
    //Added for svg files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      };
    }

    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack5: false,
  optimizeFonnts: true,
};
