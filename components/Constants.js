import { MaticPOSClient } from '@maticnetwork/maticjs';
import window from 'global';
import Butter from 'buttercms';
import ABITreasuryContract from './ABI/ABIParent';
import ABIRootToken from './ABI/ABIDummyToken';
import ABIChildToken from './ABI/ABIChildToken';
import ABITominoyaToken from './ABI/ABITominoya';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// global constant values
const API_BASE_URL = 'https://api.decentral.games';
const BASE_URL = 'https://decentral.games';
const DEFAULT_AMOUNT = 1000;
const MAX_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
const GAS_LIMIT = '3000000'; // was '900000'
const GAS_AMOUNT = '80000000000'; // was '20000000000'
const FACTOR = 1000000000000000000; // ETH-to-WEI multiplication factor
const DECIMAL_PLACES = 0;
const PARENT_NETWORK_ID = 5; // 1: Mainnet, 3: Ropsten, 5: Goerli
const MATIC_NETWORK_ID = '80001';
const MATIC_URL = 'https://rpc-mumbai.matic.today';
const MATIC_EXPLORER = 'https://mumbai-explorer.matic.today/';
const ADMIN_ADDRESSES = [
  '0xE2be94B59a3A4Aef2F66Eb0dD73079da00315BF0'.toLowerCase(),
  '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase(),
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
];
const TITLE = 'Decentral Games';
const DESCRIPTION =
  '3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!';
const BUTTER = Butter('d7d6d8425656d3cfe5f45d7a0a3a8470ef09d434'); // pass Butter CMS token
const DISCORD_URL = 'https://discord.gg/cvbSNzY';
const SOCIAL_HANDLE = '@decentralgames';
const ADDRESS_TOMINOYA = '0xF4618abb5E8031454238696A0F013DcD1476dc33';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// third-party public API keys
const KEYS = (() => {
  const BICONOMY_API = '9voMvaNpt.df75ecbb-b72e-405e-bca6-69080ac100cf';
  const TRANSAK_API = '4fcd6904-706b-4aff-bd9d-77422813bbb7';
  const GOOGLE_ANALYTICS = 'UA-146057069-1';

  return {
    BICONOMY_API,
    TRANSAK_API,
    GOOGLE_ANALYTICS,
  };
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// global token contract ABIs
const ABIs = (() => {
  const ROOT_TOKEN = ABIRootToken;
  const CHILD_TOKEN = ABIChildToken;
  const TOMINOYA_TOKEN = ABITominoyaToken;

  return {
    ROOT_TOKEN,
    CHILD_TOKEN,
    TOMINOYA_TOKEN,
  };
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// CDN image URLs
const IMAGES = (() => {
  const LOGO =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png';
  const SOCIAL_SHARE =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1595194024/twitterpreview_b1yemb.png';
  const LOADING_SPINNER =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593912197/120dgspin_okkzit.gif';
  const ICON_DAI =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/dai_l8u5ig.png';
  const ICON_MANA =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/mana_hx4tyd.png';
  const ICON_ETH =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/eth_ua2hza.png';
  const BOX =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959916/box_mjulo4.png';
  const CHECK =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959916/check_diebqd.png';
  const MANA_CIRCLE =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/mana_circle_oba61q.webp';
  const DAI_CIRCLE =
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/dai_circle_a9uwse.webp';

  return {
    LOGO,
    SOCIAL_SHARE,
    LOADING_SPINNER,
    ICON_DAI,
    ICON_MANA,
    ICON_ETH,
    BOX,
    CHECK,
    MANA_CIRCLE,
    DAI_CIRCLE,
  };
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API and MaticPOSClient instance
const sigUtil = require('eth-sig-util');

const domainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const metaTransactionType = [
  { name: 'nonce', type: 'uint256' },
  { name: 'from', type: 'address' },
  { name: 'functionSignature', type: 'bytes' },
];

let domainData = {
  name: 'Dummy Child Token',
  version: '1',
  chainId: PARENT_NETWORK_ID,
  verifyingContract: '',
};

let maticPOSClient = {};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// fetch wallet and contract addresses from server REST API
let RELAY_ADDRESS = '';
let ROOT_TOKEN_ADDRESS_DAI = '';
let ROOT_TOKEN_ADDRESS_MANA = '';
let CHILD_TOKEN_ADDRESS_DAI = '';
let CHILD_TOKEN_ADDRESS_MANA = '';
let TREASURY_CONTRACT_ADDRESS = '';
let TREASURY_SLOTS_ADDRESS = '';
let TREASURY_ROULETTE_ADDRESS = '';
let TREASURY_BACKGAMMON_ADDRESS = '';
let TREASURY_BLACKJACK_ADDRESS = '';
let ROOTCHAIN_ADDRESS = '';
let ROOTCHAINMANAGER_ADDRESS = '';

const API_ADDRESSES = (async () => {
  const response = await getAddresses();
  let json = await response.json();

  RELAY_ADDRESS = json.WORKER_WALLET_ADDRESS;
  ROOT_TOKEN_ADDRESS_DAI = json.ROOT_TOKEN_ADDRESS_DAI;
  ROOT_TOKEN_ADDRESS_MANA = json.ROOT_TOKEN_ADDRESS_MANA;
  CHILD_TOKEN_ADDRESS_DAI = json.CHILD_TOKEN_ADDRESS_DAI;
  CHILD_TOKEN_ADDRESS_MANA = json.CHILD_TOKEN_ADDRESS_MANA;
  TREASURY_CONTRACT_ADDRESS = json.TREASURY_CONTRACT_ADDRESS;
  TREASURY_SLOTS_ADDRESS = json.TREASURY_SLOTS_ADDRESS;
  TREASURY_ROULETTE_ADDRESS = json.TREASURY_ROULETTE_ADDRESS;
  TREASURY_BACKGAMMON_ADDRESS = json.TREASURY_BACKGAMMON_ADDRESS;
  TREASURY_BLACKJACK_ADDRESS = json.TREASURY_BLACKJACK_ADDRESS;
  ROOTCHAIN_ADDRESS = json.ROOTCHAIN_ADDRESS;
  ROOTCHAINMANAGER_ADDRESS = json.ROOTCHAINMANAGER_ADDRESS;

  console.log('RELAY_ADDRESS (WORKER): ' + RELAY_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('TREASURY_SLOTS_ADDRESS: ' + TREASURY_SLOTS_ADDRESS);
  console.log('TREASURY_ROULETTE_ADDRESS: ' + TREASURY_ROULETTE_ADDRESS);
  console.log('TREASURY_BACKGAMMON_ADDRESS: ' + TREASURY_BACKGAMMON_ADDRESS);
  console.log('TREASURY_BLACKJACK_ADDRESS: ' + TREASURY_BLACKJACK_ADDRESS);
  console.log('ROOTCHAIN_ADDRESS: ' + ROOTCHAIN_ADDRESS);
  console.log('ROOTCHAINMANAGER_ADDRESS: ' + ROOTCHAINMANAGER_ADDRESS);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // create MaticPOSClient object to deposit tokens from Mainnet to Matic Network
  const ethereum = await window.ethereum;

  maticPOSClient = new MaticPOSClient({
    maticProvider: MATIC_URL,
    parentProvider: ethereum,
    rootChain: ROOTCHAIN_ADDRESS,
    posRootChainManager: ROOTCHAINMANAGER_ADDRESS,
  });

  domainData.verifyingContract = CHILD_TOKEN_ADDRESS_MANA; // set verifying contract for Biconomy API

  return {
    RELAY_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    TREASURY_CONTRACT_ADDRESS,
    TREASURY_SLOTS_ADDRESS,
    TREASURY_ROULETTE_ADDRESS,
    TREASURY_BACKGAMMON_ADDRESS,
    TREASURY_BLACKJACK_ADDRESS,
    ROOTCHAIN_ADDRESS,
    ROOTCHAINMANAGER_ADDRESS,
  };
})();

function getAddresses() {
  return fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// return token contract for Biconomy API meta-transaction calls
function getTokenContract(network, web3Default = window.web3) {
  let tokenContract;

  if (network == 'root') {
    tokenContract = new web3Default.eth.Contract(
      ABIs.ROOT_TOKEN,
      ROOT_TOKEN_ADDRESS_MANA
    );
  } else if (network == 'child') {
    tokenContract = new web3Default.eth.Contract(
      ABIs.CHILD_TOKEN,
      CHILD_TOKEN_ADDRESS_MANA
    );
  }

  return tokenContract;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get user or contract token balance from MetaMask
function balanceOfToken(tokenContract, userAddress) {
  return new Promise(async (resolve, reject) => {
    console.log('Get balance of token');

    try {
      tokenContract.balanceOf(userAddress, async function (err, amount) {
        if (err) {
          console.log('Get balance failed', err);
          reject(false);
        }

        console.log('Get balance done');
        const amountAdjusted = (amount / FACTOR)
          .toFixed(DECIMAL_PLACES)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        resolve(amountAdjusted);
      });
    } catch (error) {
      console.log('Get balance failed', error);
      reject(false);
    }
  });

  // console.log('Get balance of token');

  // try {
  //   const balance = await tokenContract.methods.balanceOf(userAddress).call();

  //   console.log('Get balance done');
  //   const amountAdjusted = (amount / FACTOR)
  //     .toFixed(DECIMAL_PLACES)
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   return amountAdjusted;
  // } catch (error) {
  //   console.log('Get balance failed: ', error);

  //   return false;
  // }
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// returns the amount of MANA contractAddress is approved to spend on behalf of the user
function getAllowedToken(tokenAddress, userAddress, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('Get allowed tokens');
    console.log('Token address: ' + tokenAddress);
    console.log('User address: ' + userAddress);

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(ABIs.CHILD_TOKEN)
        .at(tokenAddress);

      TOKEN_CONTRACT.allowance(
        userAddress,
        ROOTCHAINMANAGER_ADDRESS,
        async function (err, amount) {
          if (err) {
            console.log('Get allowed failed', err);
            reject(false);
          }

          console.log('Get allowed done');
          resolve(amount);
        }
      );
    } catch (error) {
      console.log('Get allowed failed: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// allows tokenAddress to spend given amount of tokens on user's behalf
function approveToken(
  tokenAddress,
  amount,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('Approve token contract');
    console.log('Token address: ' + tokenAddress);
    console.log('Amount: ' + amount);
    console.log('User address: ' + userAddress);

    try {
      await maticPOSClient.approveERC20ForDeposit(tokenAddress, amount, {
        from: userAddress,
        gasLimit: web3Default.toHex(GAS_LIMIT),
        gasPrice: web3Default.toHex(GAS_AMOUNT),
      });

      console.log('Approve done');
      resolve(true);
    } catch (error) {
      console.log('Approve failed: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// deposit tokens from the Matic Root contract to Matic Network
function depositTokenToMatic(
  tokenAddress,
  amount,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit to Matic Network');
    console.log('Token address: ' + tokenAddress);
    console.log('Amount:' + amount);
    console.log('User address: ' + userAddress);

    try {
      const logs = await maticPOSClient.depositERC20ForUser(
        tokenAddress,
        userAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex(GAS_AMOUNT),
        }
      );

      console.log('Deposit done');
      resolve(logs.transactionHash);
    } catch (error) {
      console.log('Deposit failed: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// withdraw tokens from Matic Network to Mainnet
function exitToMainnet(transactionHash, userAddress) {
  return new Promise(async (resolve, reject) => {
    console.log('Exit to Mainnet start');
    console.log('transaction hash: ' + transactionHash);
    console.log('user address: ' + userAddress);

    try {
      let ret = await maticPOSClient.exitERC20(transactionHash, {
        from: userAddress,
      });

      console.log('Exit to Mainnet done');
      resolve(ret.transactionHash);
    } catch (error) {
      console.log('Exit to Mainnet failed: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get balance from parent contract and allocated tokens from slots and roulette games
function getBalanceParent(tokenName, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('Get balance of parent contract');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABITreasuryContract)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.getBalanceByTokenName(tokenName, async function (
        err,
        amount
      ) {
        if (err) {
          console.log('Get balance failed', err);
          reject(false);
        }

        console.log('Get balance done');
        resolve(amount);
      });
    } catch (error) {
      console.log('Get balance failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get allocated tokens for specified game
function getTokensGame(gameType, tokenName, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('Get tokens per game');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABITreasuryContract)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.checkAllocatedTokensPerGame(
        gameType,
        tokenName,
        async function (err, amount) {
          if (err) {
            console.log('Get tokens per game failed', err);
            reject(false);
          }

          console.log('Get tokens per game done');
          resolve(amount);
        }
      );
    } catch (error) {
      console.log('Get tokens per game failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// deposit funds to parent contract
function depositToParent(gameType, amount, tokenName) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit start:' + amount);
    const userAddress = window.web3.currentProvider.selectedAddress;

    try {
      const PARENT_CONTRACT = window.web3.eth
        .contract(ABITreasuryContract)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.addFunds(
        gameType,
        amount,
        tokenName,
        {
          from: userAddress,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex(GAS_AMOUNT),
        },
        async function (err, hash) {
          if (err) {
            console.log('Deposit failed', err);
            reject(false);
          }

          console.log('Deposit done');
          resolve(hash);
        }
      );
    } catch (error) {
      console.log('Deposit failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// withdraw funds from parent contract
function withdrawFromParent(gameType, amount, tokenName) {
  return new Promise(async (resolve, reject) => {
    console.log('Withdraw start: ' + amount);
    const userAddress = window.web3.currentProvider.selectedAddress;

    try {
      const PARENT_CONTRACT = window.web3.eth
        .contract(ABITreasuryContract)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.withdrawCollateral(
        gameType,
        amount,
        tokenName,
        {
          from: userAddress,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex(GAS_AMOUNT),
        },
        async function (err, hash) {
          if (err) {
            console.log('Withdraw failed', err);
            reject(false);
          }

          console.log('Withdraw done');
          resolve(hash);
        }
      );
    } catch (error) {
      console.log('Withdraw failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// execute functions on Matic Network from Mainnet using Biconomy PoS meta-transactions API
function executeMetaTransaction(
  functionSignature,
  tokenContract,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('Execute Biconomy PoS meta-transaction');
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Chain ID: ' + domainData.chainId);
    console.log('Verify contract: ' + domainData.verifyingContract);

    try {
      let nonce = await tokenContract.methods.getNonce(userAddress).call();

      let message = {};
      message.nonce = parseInt(nonce);
      message.from = userAddress;
      message.functionSignature = functionSignature;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType,
        },
        domain: domainData,
        primaryType: 'MetaTransaction',
        message: message,
      });

      console.log('Domain data: ');
      console.log(domainData);

      await web3Default.eth.currentProvider.send(
        {
          jsonrpc: '2.0',
          id: 999999999999,
          method: 'eth_signTypedData_v4',
          params: [userAddress, dataToSign],
        },

        async (error, response) => {
          let { r, s, v } = getSignatureParameters(
            response.result,
            web3Default
          );

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result,
          });

          console.log('User signature: ' + response.result);
          console.log('Recovered address: ' + recovered);
          console.log('r: ' + r);
          console.log('s: ' + s);
          console.log('v: ' + v);

          try {
            const ret = await tokenContract.methods
              .executeMetaTransaction(userAddress, functionSignature, r, s, v)
              .send({
                from: userAddress,
              });

            console.log('Execute Meta-Transactions done');
            resolve(ret.transactionHash);
          } catch (error) {
            console.log('Execute Meta-Transactions failed: ', error);
            reject(false);
          }
        }
      );
    } catch (error) {
      console.log('Execute Meta-Transactions failed: ', error);
      reject(false);
    }
  });
}

function getSignatureParameters(signature, web3Default = window.web3) {
  if (!web3Default.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }

  const r = signature.slice(0, 66);
  const s = '0x'.concat(signature.slice(66, 130));
  let v = '0x'.concat(signature.slice(130, 132));
  v = web3Default.utils.hexToNumber(v);

  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// return confirmation hash
function getConfirmedTx(txHash) {
  return new Promise(async (resolve, reject) => {
    let finish = false;

    while (!finish) {
      window.web3.eth.getTransactionReceipt(txHash, (err, res) => {
        if (err) {
          finish = true;
          reject(err);
        }
        if (res) {
          finish = true;
          resolve(res);
        }
      });

      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(2000);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// REST API functions: get parcel data for particular token ID
async function getParcelData(landID, tokenID) {
  console.log('Fetch NFT parcel data');
  console.log('Land ID: ' + landID);
  console.log('Token ID: ' + tokenID);

  const response = await fetchParcelData(landID, tokenID);
  const json = await response.json();

  return json;
}

function fetchParcelData(landID, tokenID) {
  return fetch(`${API_BASE_URL}/nft/${landID}/${tokenID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export default {
  API_ADDRESSES,
  ABIs,
  ADDRESS_TOMINOYA,
  API_BASE_URL,
  BASE_URL,
  DEFAULT_AMOUNT,
  MAX_AMOUNT,
  FACTOR,
  PARENT_NETWORK_ID,
  MATIC_NETWORK_ID,
  MATIC_URL,
  MATIC_EXPLORER,
  KEYS,
  ADMIN_ADDRESSES,
  TITLE,
  DESCRIPTION,
  BUTTER,
  DISCORD_URL,
  SOCIAL_HANDLE,
  IMAGES,
  getTokenContract,
  balanceOfToken,
  getAllowedToken,
  approveToken,
  depositTokenToMatic,
  exitToMainnet,
  getBalanceParent,
  getTokensGame,
  depositToParent,
  withdrawFromParent,
  executeMetaTransaction,
  getConfirmedTx,
  getParcelData,
};
