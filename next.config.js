// potential help with css loading issues
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    url: false
  }
})

// analyze the code bundles that are generated with Next.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

module.exports = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
