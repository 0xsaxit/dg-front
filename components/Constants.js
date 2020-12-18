import Fetch from '../common/Fetch';

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
  ACTIVE_PERIOD: 43200, // user account active period: 3600 === 1 hour // 43200
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

// fetch wallet and contract addresses from server API
const API_ADDRESSES = (async () => {
  if (window.ethereum) {
    const userAddress = window.web3.currentProvider.selectedAddress;

    if (userAddress) {
      // ************************* this will return an error if new wallet address *************************

      const response = await Fetch.GET_ADDRESSES(userAddress);
      let json = await response.json();

      const OWNER_WALLET_ADDRESS = json.OWNER_WALLET_ADDRESS;
      const WORKER_WALLET_ADDRESS = json.WORKER_WALLET_ADDRESS;
      const ROOT_TOKEN_ADDRESS_DAI = json.ROOT_TOKEN_ADDRESS_DAI;
      const ROOT_TOKEN_ADDRESS_MANA = json.ROOT_TOKEN_ADDRESS_MANA;
      const ROOT_TOKEN_ADDRESS_DG = json.ROOT_TOKEN_ADDRESS_DG;
      const CHILD_TOKEN_ADDRESS_DAI = json.CHILD_TOKEN_ADDRESS_DAI;
      const CHILD_TOKEN_ADDRESS_MANA = json.CHILD_TOKEN_ADDRESS_MANA;
      const CHILD_TOKEN_ADDRESS_DG = json.CHILD_TOKEN_ADDRESS_DG;
      const TREASURY_CONTRACT_ADDRESS = json.TREASURY_CONTRACT_ADDRESS;
      const DG_POINTER_CONTRACT_ADDRESS = json.DG_POINTER_CONTRACT_ADDRESS;
      const DG_STAKING_CONTRACT_ADDRESS = json.DG_STAKING_CONTRACT_ADDRESS;
      const DG_STAKING_CONTRACT_ADDRESS_2 = json.DG_STAKING_CONTRACT_ADDRESS_2;
      const DG_GOVERNANCE_CONTRACT_ADDRESS =
        json.DG_GOVERNANCE_CONTRACT_ADDRESS;
      const DG_KEEPER_CONTRACT_ADDRESS = json.DG_KEEPER_CONTRACT_ADDRESS;
      const BP_TOKEN_ADDRESS = json.BP_TOKEN_ADDRESS;
      const BP_TOKEN_ADDRESS_2 = json.BP_TOKEN_ADDRESS_2;
      const TOMINOYA_CONTRACT_ADDRESS = json.TOMINOYA_CONTRACT_ADDRESS;
      const ADMIN_ADDRESSES = json.ADMIN_ADDRESSES;

      const DG_STAKING_GOV = '0xf1d113059517dbddd99ab9caffa76fc01f0557cd';
      // const DG_TOKEN = '0xee06a81a695750e71a662b51066f2c74cf4478a0';

      console.log('OWNER_WALLET_ADDRESS: ' + OWNER_WALLET_ADDRESS);
      console.log('WORKER_WALLET_ADDRESS: ' + WORKER_WALLET_ADDRESS);
      console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
      console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
      console.log('ROOT_TOKEN_ADDRESS_DG: ' + ROOT_TOKEN_ADDRESS_DG);
      console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
      console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
      console.log('CHILD_TOKEN_ADDRESS_DG: ' + CHILD_TOKEN_ADDRESS_DG);
      console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
      console.log(
        'DG_POINTER_CONTRACT_ADDRESS: ' + DG_POINTER_CONTRACT_ADDRESS
      );
      console.log(
        'DG_STAKING_CONTRACT_ADDRESS: ' + DG_STAKING_CONTRACT_ADDRESS
      );
      console.log(
        'DG_STAKING_CONTRACT_ADDRESS_2: ' + DG_STAKING_CONTRACT_ADDRESS_2
      );
      console.log(
        'DG_GOVERNANCE_CONTRACT_ADDRESS: ' + DG_GOVERNANCE_CONTRACT_ADDRESS
      );
      console.log('DG_KEEPER_CONTRACT_ADDRESS: ' + DG_KEEPER_CONTRACT_ADDRESS);
      console.log('BP_TOKEN_ADDRESS: ' + BP_TOKEN_ADDRESS);
      console.log('BP_TOKEN_ADDRESS_2: ' + BP_TOKEN_ADDRESS_2);
      console.log('TOMINOYA_CONTRACT_ADDRESS: ' + TOMINOYA_CONTRACT_ADDRESS);

      return {
        OWNER_WALLET_ADDRESS,
        WORKER_WALLET_ADDRESS,
        ROOT_TOKEN_ADDRESS_DAI,
        ROOT_TOKEN_ADDRESS_MANA,
        ROOT_TOKEN_ADDRESS_DG,
        CHILD_TOKEN_ADDRESS_DAI,
        CHILD_TOKEN_ADDRESS_MANA,
        CHILD_TOKEN_ADDRESS_DG,
        TREASURY_CONTRACT_ADDRESS,
        DG_POINTER_CONTRACT_ADDRESS,
        DG_STAKING_CONTRACT_ADDRESS,
        DG_STAKING_CONTRACT_ADDRESS_2,
        DG_GOVERNANCE_CONTRACT_ADDRESS,
        DG_KEEPER_CONTRACT_ADDRESS,
        BP_TOKEN_ADDRESS,
        BP_TOKEN_ADDRESS_2,
        TOMINOYA_CONTRACT_ADDRESS,
        ADMIN_ADDRESSES,
        DG_STAKING_GOV,
        // DG_TOKEN,
      };
    }
  }
})();

export default {
  KEYS,
  CONSTANTS,
  API_ADDRESSES,
};
