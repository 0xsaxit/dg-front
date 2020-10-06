import Fetch from '../common/Fetch';

// third-party public API keys
const KEYS = {
  BICONOMY_API: 'spWcIKmce.df09f12f-b278-4093-8ca5-0dfafd5b37a7',
  TRANSAK_API: '4fcd6904-706b-4aff-bd9d-77422813bbb7',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
};

// admin area access accounts
const ADMIN_ADDRESSES = [
  '0xE2be94B59a3A4Aef2F66Eb0dD73079da00315BF0',
  '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28',
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45',
  '0x503aaA04A19e0c4b04d1E109F1369C1f2e85fDF0',
];

// common constant values
const CONSTANTS = {
  BASE_URL: 'https://decentral.games',
  MAX_AMOUNT:
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  GAS_LIMIT: '3000000', // was '900000'
  GAS_AMOUNT: '80000000000', // was '20000000000'
  FACTOR: 1000000000000000000, // ETH-to-WEI multiplication factor
  PARENT_NETWORK_ID: 5, // 1: Mainnet, 3: Ropsten, 5: Goerli
  ACTIVE_PERIOD: 43200, // user account active period: 3600 === 1 hour // 43200
  MATIC_NETWORK_ID: 80001,
  MATIC_URL: 'https://rpc-mumbai.matic.today',
  MATIC_EXPLORER: 'https://mumbai-explorer.matic.today',
  TITLE: 'Decentral Games',
  DESCRIPTION:
    '3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
  ADDRESS_TOMINOYA: '0xF4618abb5E8031454238696A0F013DcD1476dc33',
};

// fetch wallet and contract addresses from server API
const API_ADDRESSES = (async () => {
  const response = await Fetch.GET_ADDRESSES();
  let json = await response.json();

  const WORKER_ADDRESS = json.WORKER_WALLET_ADDRESS;
  const ROOT_TOKEN_ADDRESS_DAI = json.ROOT_TOKEN_ADDRESS_DAI;
  const ROOT_TOKEN_ADDRESS_MANA = json.ROOT_TOKEN_ADDRESS_MANA;
  const CHILD_TOKEN_ADDRESS_DAI = json.CHILD_TOKEN_ADDRESS_DAI;
  const CHILD_TOKEN_ADDRESS_MANA = json.CHILD_TOKEN_ADDRESS_MANA;
  const TREASURY_CONTRACT_ADDRESS = json.TREASURY_CONTRACT_ADDRESS;
  const DG_POINTER_ADDRESS = json.DG_POINTER_ADDRESS;

  console.log('WORKER_ADDRESS: ' + WORKER_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('DG_POINTER_ADDRESS: ' + DG_POINTER_ADDRESS);

  return {
    WORKER_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    TREASURY_CONTRACT_ADDRESS,
    DG_POINTER_ADDRESS,
  };
})();

export default {
  KEYS,
  ADMIN_ADDRESSES,
  CONSTANTS,
  API_ADDRESSES,
};
