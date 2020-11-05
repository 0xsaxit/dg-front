import Fetch from '../common/Fetch';

// third-party public API keys
const KEYS = {
  BICONOMY_API: 'iW9B13586.996fe1e6-5969-40cb-b986-6ea37cfeec8f',
  TRANSAK_API: '4fcd6904-706b-4aff-bd9d-77422813bbb7',
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
  ACTIVE_PERIOD: 43200, // user account active period: 3600 === 1 hour // 43200
  MATIC_NETWORK_ID: 137, // mumbai: 80001, mainnet: 137
  MATIC_URL:
    'https://rpc-mainnet.maticvigil.com/v1/77716f1e281178d28966c64ff271bde0aa1570d9', // 'https://rpc-mumbai.matic.today', 'https://rpc-mainnet.maticvigil.com/v1/77716f1e281178d28966c64ff271bde0aa1570d9'
  MATIC_EXPLORER: 'https://explorer-mainnet.maticvigil.com', // 'https://mumbai-explorer.matic.today',
  TITLE: 'Decentral Games',
  DESCRIPTION:
    'The first community-owned, Metaverse casino. Provably fair game logic, non-custodial accounts, immediate payouts.',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
};

// fetch wallet and contract addresses from server API
const API_ADDRESSES = (async () => {
  const response = await Fetch.GET_ADDRESSES();
  let json = await response.json();

  const WORKER_ADDRESS = json.WORKER_WALLET_ADDRESS;
  const ROOT_TOKEN_ADDRESS_DAI = json.ROOT_TOKEN_ADDRESS_DAI;
  const ROOT_TOKEN_ADDRESS_MANA = json.ROOT_TOKEN_ADDRESS_MANA;
  const ROOT_TOKEN_ADDRESS_DG = json.ROOT_TOKEN_ADDRESS_DG;
  const CHILD_TOKEN_ADDRESS_DAI = json.CHILD_TOKEN_ADDRESS_DAI;
  const CHILD_TOKEN_ADDRESS_MANA = json.CHILD_TOKEN_ADDRESS_MANA;
  const CHILD_TOKEN_ADDRESS_DG = json.CHILD_TOKEN_ADDRESS_DG;
  const TREASURY_CONTRACT_ADDRESS = json.TREASURY_CONTRACT_ADDRESS;
  const DG_POINTER_CONTRACT_ADDRESS = json.DG_POINTER_CONTRACT_ADDRESS;
  const DG_STAKING_CONTRACT_ADDRESS = json.DG_STAKING_CONTRACT_ADDRESS;
  const BP_TOKEN_ADDRESS = json.BP_TOKEN_ADDRESS;
  const TOMINOYA_CONTRACT_ADDRESS = json.TOMINOYA_CONTRACT_ADDRESS;

  console.log('WORKER_ADDRESS: ' + WORKER_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('ROOT_TOKEN_ADDRESS_DG: ' + ROOT_TOKEN_ADDRESS_DG);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DG: ' + CHILD_TOKEN_ADDRESS_DG);
  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS: ' + DG_POINTER_CONTRACT_ADDRESS);
  console.log('DG_STAKING_CONTRACT_ADDRESS: ' + DG_STAKING_CONTRACT_ADDRESS);
  console.log('BP_TOKEN_ADDRESS: ' + BP_TOKEN_ADDRESS);
  console.log('TOMINOYA_CONTRACT_ADDRESS: ' + TOMINOYA_CONTRACT_ADDRESS);

  return {
    WORKER_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    ROOT_TOKEN_ADDRESS_DG,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DG,
    TREASURY_CONTRACT_ADDRESS,
    DG_POINTER_CONTRACT_ADDRESS,
    DG_STAKING_CONTRACT_ADDRESS,
    BP_TOKEN_ADDRESS,
    TOMINOYA_CONTRACT_ADDRESS,
  };
})();

export default {
  KEYS,
  CONSTANTS,
  API_ADDRESSES,
};
