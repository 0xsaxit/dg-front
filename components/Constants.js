// third-party public API keys
const KEYS = {
  BICONOMY_API: 'iW9B13586.996fe1e6-5969-40cb-b986-6ea37cfeec8f',
  TRANSAK_API: '6f2cd88d-b241-4cdb-8f1a-a034cda14bf6',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
  SEGMENT_WRITE_KEY: 'pK03oncLYCxY1DJtTmnJnuwLByq2RlAb',
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
  MATIC_URL: 'https://rpc-mainnet.maticvigil.com/v1/03db49966edbf82fb60cb4e04b2c3b4fec306219', // 'https://rpc-mainnet.matic.network',
  BICONOMY_ENDPOINT: 'https://rpc-mainnet.maticvigil.com/v1/2ac03d4fd9d671e79063e071828a5260d3752de3',
  MATIC_EXPLORER: 'https://explorer-mainnet.maticvigil.com',
  TITLE: 'Decentral Games',
  DESCRIPTION:
    'The first community-owned, Metaverse casino. Provably fair game logic, non-custodial accounts, immediate payouts.',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
};

// wallet and contract addresses
const ADDRESSES = (() => {
  const OWNER_WALLET_ADDRESS = '0x3c383b7ffd5d2bf24ebd1fc8509cefa9b7d1976f';
  const WORKER_WALLET_ADDRESS = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A';
  const ROOT_TOKEN_ADDRESS_DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const ROOT_TOKEN_ADDRESS_MANA = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';
  const ROOT_TOKEN_ADDRESS_DG = '0xee06a81a695750e71a662b51066f2c74cf4478a0';
  const CHILD_TOKEN_ADDRESS_DAI = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
  const CHILD_TOKEN_ADDRESS_MANA = '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4';
  const CHILD_TOKEN_ADDRESS_DG = '0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4';
  const TREASURY_CONTRACT_ADDRESS = '0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3';
  const DG_POINTER_CONTRACT_ADDRESS = '0x11e46DB40d4438D1c64f68993CA43b03Ac1B6A6B';
  const DG_STAKING_BALANCER_ADDRESS_1 = '0xA9380E21fF4Ed3218a7a518D16c464ff0DcBf143';
  const DG_STAKING_BALANCER_ADDRESS_2 = '0x444b3917f08a0c7a39267b1ec2f46713c5492db2';
  const DG_STAKING_UNISWAP_ADDRESS = '0x55ceb773c494cf7ad4f2e3170936866bd7eff1c9';
  const DG_GOVERNANCE_CONTRACT_ADDRESS = '';
  const DG_STAKING_GOVERNANCE_ADDRESS = '0xf1d113059517dbddd99ab9caffa76fc01f0557cd';
  const DG_KEEPER_CONTRACT_ADDRESS = '0x6b5C29B035Ec40a7cE567f1F11cc90eBfa4f1D17';
  const BP_TOKEN_ADDRESS_1 = '0xca54c398195fce98856888b0fd97a9470a140f71';
  const BP_TOKEN_ADDRESS_2 = '0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d';
  const UNISWAP_ADDRESS_STAKING = '0x44c21f5dcb285d92320ae345c92e8b6204be8cdf';
  const UNISWAP_ADDRESS_WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const TOMINOYA_CONTRACT_ADDRESS = '0xF4618abb5E8031454238696A0F013DcD1476dc33';

  console.log('OWNER_WALLET_ADDRESS: ' + OWNER_WALLET_ADDRESS);
  console.log('WORKER_WALLET_ADDRESS: ' + WORKER_WALLET_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('ROOT_TOKEN_ADDRESS_DG: ' + ROOT_TOKEN_ADDRESS_DG);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DG: ' + CHILD_TOKEN_ADDRESS_DG);
  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS: ' + DG_POINTER_CONTRACT_ADDRESS);
  console.log('DG_STAKING_BALANCER_ADDRESS_1: ' + DG_STAKING_BALANCER_ADDRESS_1);
  console.log('DG_STAKING_BALANCER_ADDRESS_2: ' + DG_STAKING_BALANCER_ADDRESS_2);
  console.log('DG_STAKING_UNISWAP_ADDRESS: ' + DG_STAKING_UNISWAP_ADDRESS);
  console.log('DG_GOVERNANCE_CONTRACT_ADDRESS: ' + DG_GOVERNANCE_CONTRACT_ADDRESS);
  console.log('DG_STAKING_GOVERNANCE_ADDRESS: ' + DG_STAKING_GOVERNANCE_ADDRESS);
  console.log('DG_KEEPER_CONTRACT_ADDRESS: ' + DG_KEEPER_CONTRACT_ADDRESS);
  console.log('BP_TOKEN_ADDRESS_1: ' + BP_TOKEN_ADDRESS_1);
  console.log('BP_TOKEN_ADDRESS_2: ' + BP_TOKEN_ADDRESS_2);
  console.log('UNISWAP_ADDRESS_STAKING: ' + UNISWAP_ADDRESS_STAKING);
  console.log('UNISWAP_ADDRESS_WETH: ' + UNISWAP_ADDRESS_WETH);
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
    DG_STAKING_BALANCER_ADDRESS_1,
    DG_STAKING_BALANCER_ADDRESS_2,
    DG_STAKING_UNISWAP_ADDRESS,
    DG_GOVERNANCE_CONTRACT_ADDRESS,
    DG_STAKING_GOVERNANCE_ADDRESS,
    DG_KEEPER_CONTRACT_ADDRESS,
    BP_TOKEN_ADDRESS_1,
    BP_TOKEN_ADDRESS_2,
    UNISWAP_ADDRESS_STAKING,
    UNISWAP_ADDRESS_WETH,
    TOMINOYA_CONTRACT_ADDRESS,
  };
})();

export default {
  KEYS,
  CONSTANTS,
  ADDRESSES,
};
