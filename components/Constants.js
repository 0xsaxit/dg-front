// third-party public API keys
const KEYS = {
  BICONOMY_API: 'iW9B13586.996fe1e6-5969-40cb-b986-6ea37cfeec8f',
  TRANSAK_API: '6f2cd88d-b241-4cdb-8f1a-a034cda14bf6',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
};

// common constant values
const CONSTANTS = {
  BASE_URL: 'https://decentral.games',
  MAX_AMOUNT:
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  GAS_LIMIT: '3000000', // was '900000'
  GAS_AMOUNT: '80000000000', // was '20000000000'
  FACTOR: 1000000000000000000, // ETH-to-WEI multiplication factor
  PARENT_NETWORK_ID: 1, // 1: Mainnet, 3: Ropsten, 5: Goerli
  ACTIVE_PERIOD: 5, // 43200, // user account active period: 3600 === 1 hour // 43200
  MATIC_NETWORK_ID: 137, // Mumbai: 80001, Mainnet: 137
  MATIC_URL:
    'https://rpc-mainnet.maticvigil.com/v1/77716f1e281178d28966c64ff271bde0aa1570d9',
  MATIC_EXPLORER: 'https://explorer-mainnet.maticvigil.com',
  TITLE: 'Decentral Games',
  DESCRIPTION:
    'The first community-owned, Metaverse casino. Provably fair game logic, non-custodial accounts, immediate payouts.',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
};

export default {
  KEYS,
  CONSTANTS,
};
