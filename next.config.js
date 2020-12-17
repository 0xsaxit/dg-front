// potential help with css loading issues
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    url: false
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})

// analyze the code bundles that are generated with Next.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});
