require('dotenv').config({path:'.env.website'})

const withImages = require('next-images');
const path = require('path');
console.log(__dirname);
module.exports = withImages({
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      API_BASE_URL: process.env.API_BASE_URL,
      BASE_URL: process.env.BASE_URL,
      ROPSTEN_TOKEN: process.env.ROPSTEN_TOKEN,
      MATIC_TOKEN: process.env.MATIC_TOKEN,
      TOKEN_DECIMALS: process.env.TOKEN_DECIMALS,
      ROOTCHAIN_ADDRESS: process.env.ROOTCHAIN_ADDRESS,
      DEPOSITMANAGER_ADDRESS: process.env.DEPOSITMANAGER_ADDRESS,
      WITHDRAWMANAGER_ADDRESS: process.env.WITHDRAWMANAGER_ADDRESS,
      SYNCER_URL: process.env.SYNCER_URL,
      WATCHER_URL: process.env.WATCHER_URL,
      MAX_AMOUNT: process.env.MAX_AMOUNT,
      GAS_LIMIT: process.env.GAS_LIMIT,
      MATIC_NETWORK_ID: process.env.MATIC_NETWORK_ID,
    },
    exclude: path.resolve(__dirname, 'static/images2'),
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }

      return config
    }
//    webpack(config, options) {
//        return config
//    }
})
