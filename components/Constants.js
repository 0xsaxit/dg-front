import Butter from 'buttercms';
import ABITreasuryContract from './ABI/ABITreasury';
import ABIRootToken from './ABI/ABIDummyToken';
import ABIChildToken from './ABI/ABIChildToken';
import ABITominoyaToken from './ABI/ABITominoya';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// third-party public API keys
const KEYS = {
  BICONOMY_API: 'spWcIKmce.df09f12f-b278-4093-8ca5-0dfafd5b37a7',
  TRANSAK_API: '4fcd6904-706b-4aff-bd9d-77422813bbb7',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// common constant values
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
const ACTIVE_PERIOD = 43200; // user account active period: 3600 == 1 hour
const MATIC_NETWORK_ID = 80001;
const MATIC_URL = 'https://rpc-mumbai.matic.today';
const MATIC_EXPLORER = 'https://mumbai-explorer.matic.today';
const ADMIN_ADDRESSES = [
  '0xE2be94B59a3A4Aef2F66Eb0dD73079da00315BF0'.toLowerCase(),
  '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase(),
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
  '0x503aaA04A19e0c4b04d1E109F1369C1f2e85fDF0'.toLowerCase(),
];
const TITLE = 'Decentral Games';
const DESCRIPTION =
  '3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!';
const BUTTER = Butter(KEYS.BUTTER_TOKEN);
const DISCORD_URL = 'https://discord.gg/cvbSNzY';
const SOCIAL_HANDLE = '@decentralgames';
const ADDRESS_TOMINOYA = '0xF4618abb5E8031454238696A0F013DcD1476dc33';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API
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

let domainArray = [];

const domainDataToken = {
  name: 'Dummy ERC20',
  version: '1',
  chainId: PARENT_NETWORK_ID,
  verifyingContract: '',
};

const domainDataTreasury = {
  name: 'Treasury',
  version: 'v3.0',
  chainId: PARENT_NETWORK_ID,
  verifyingContract: '',
};

domainArray.push(domainDataToken);
domainArray.push(domainDataTreasury);

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// global token contract ABIs
const ABIs = (() => {
  const TREASURY_CONTRACT = ABITreasuryContract;
  const ROOT_TOKEN = ABIRootToken;
  const CHILD_TOKEN = ABIChildToken;
  const TOMINOYA_TOKEN = ABITominoyaToken;

  return {
    TREASURY_CONTRACT,
    ROOT_TOKEN,
    CHILD_TOKEN,
    TOMINOYA_TOKEN,
  };
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// common image URLs
const IMAGES = {
  LOGO:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png',
  SOCIAL_SHARE:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1595194024/twitterpreview_b1yemb.png',
  LOADING_SPINNER:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1598491023/ezgif.com-optimize_1_a6yuus.gif',
  ICON_DAI:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/5_hgyzty.png',
  ICON_MANA:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/Bitmap_1_cwsnkg.png',
  ICON_ETH:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959917/eth_ua2hza.png',
  BOX:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959916/box_mjulo4.png',
  CHECK:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1593959916/check_diebqd.png',
  MANA_CIRCLE:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/Bitmap_1_cwsnkg.png',
  DAI_CIRCLE:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/5_hgyzty.png',
  PLAY_CIRCLE:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/Group_qxqvxl.png',
  ICON_PLAY:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599762928/Group_qxqvxl.png',
  MATIC_TOP:
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1597255979/Screen_Shot_2020-08-12_at_11.12.47_AM_dbmtla.png',
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// REST API functions: GET/POST data to server API endpoints
const FETCH = {
  GET_ADDRESSES: () => {
    return fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  },

  USER_STATUS: (address) => {
    return fetch(`${API_BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
      }),
    });
  },

  COUNTRY_CODE: () => {
    return fetch(`https://ipapi.co/json`);
  },

  PARCEL_DATA: (landID, tokenID) => {
    return fetch(`${API_BASE_URL}/nft/${landID}/${tokenID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  },

  PLAYER_INFO: (address) => {
    return fetch(`${API_BASE_URL}/admin/getUser?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  TOP_UP_USER: (address) => {
    return fetch(`https://api.decentral.games/order/topup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
      }),
    });
  },

  HISTORY_DATA: (address) => {
    return fetch(`${API_BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        limit: 99999, // fetch all of the data
        page: 1,
      }),
    });
  },

  PLAY_DATA: (address) => {
    return fetch(`${API_BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        limit: 99999, // fetch all of the data
        page: 1,
      }),
    });
  },

  GAME_RECORDS: () => {
    return fetch(`${API_BASE_URL}/admin/getTotalRecords`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  USER_NUMBERS: () => {
    return fetch(`${API_BASE_URL}/players/getPlayerCount`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  USER_VERIFY: (address, step) => {
    return fetch(`${API_BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        verifyStep: step,
      }),
    });
  },

  POST_HISTORY: (address, amount, type, state, txHash, step) => {
    return fetch(`${API_BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        amount: amount,
        type: type,
        state: state,
        txHash: txHash,
        step: step,
      }),
    });
  },

  ADMIN_HISTORY: () => {
    return fetch(`${API_BASE_URL}/admin/getHistory`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  MACHINE_DATA: () => {
    return fetch(`${API_BASE_URL}/admin/getMachine`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// fetch wallet and contract addresses from server REST API
let WORKER_ADDRESS = '';
let ROOT_TOKEN_ADDRESS_DAI = '';
let ROOT_TOKEN_ADDRESS_MANA = '';
let CHILD_TOKEN_ADDRESS_DAI = '';
let CHILD_TOKEN_ADDRESS_MANA = '';
let TREASURY_CONTRACT_ADDRESS = '';

// nlet TREASURY_SLOTS_ADDRESS = '';
// let TREASURY_ROULETTE_ADDRESS = '';
// let TREASURY_BACKGAMMON_ADDRESS = '';
// let TREASURY_BLACKJACK_ADDRESS = '';
// let ROOTCHAIN_ADDRESS = '';
// let ROOTCHAINMANAGER_ADDRESS = '';

const API_ADDRESSES = (async () => {
  const response = await FETCH.GET_ADDRESSES();
  let json = await response.json();

  WORKER_ADDRESS = json.WORKER_WALLET_ADDRESS;
  ROOT_TOKEN_ADDRESS_DAI = json.ROOT_TOKEN_ADDRESS_DAI;
  ROOT_TOKEN_ADDRESS_MANA = json.ROOT_TOKEN_ADDRESS_MANA;
  CHILD_TOKEN_ADDRESS_DAI = json.CHILD_TOKEN_ADDRESS_DAI;
  CHILD_TOKEN_ADDRESS_MANA = json.CHILD_TOKEN_ADDRESS_MANA;
  TREASURY_CONTRACT_ADDRESS = json.TREASURY_CONTRACT_ADDRESS;

  // TREASURY_SLOTS_ADDRESS = json.TREASURY_SLOTS_ADDRESS;
  // TREASURY_ROULETTE_ADDRESS = json.TREASURY_ROULETTE_ADDRESS;
  // TREASURY_BACKGAMMON_ADDRESS = json.TREASURY_BACKGAMMON_ADDRESS;
  // TREASURY_BLACKJACK_ADDRESS = json.TREASURY_BLACKJACK_ADDRESS;
  // ROOTCHAIN_ADDRESS = json.ROOTCHAIN_ADDRESS;
  // ROOTCHAINMANAGER_ADDRESS = json.ROOTCHAINMANAGER_ADDRESS;

  console.log('WORKER_ADDRESS: ' + WORKER_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);

  // console.log('TREASURY_SLOTS_ADDRESS: ' + TREASURY_SLOTS_ADDRESS);
  // console.log('TREASURY_ROULETTE_ADDRESS: ' + TREASURY_ROULETTE_ADDRESS);
  // console.log('TREASURY_BACKGAMMON_ADDRESS: ' + TREASURY_BACKGAMMON_ADDRESS);
  // console.log('TREASURY_BLACKJACK_ADDRESS: ' + TREASURY_BLACKJACK_ADDRESS);
  // console.log('ROOTCHAIN_ADDRESS: ' + ROOTCHAIN_ADDRESS);
  //console.log('ROOTCHAINMANAGER_ADDRESS: ' + ROOTCHAINMANAGER_ADDRESS);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // create MaticPOSClient object to deposit tokens from Mainnet to Matic Network
  // const ethereum = await window.ethereum;

  // maticPOSClient = new MaticPOSClient({
  //   maticProvider: MATIC_URL,
  //   parentProvider: ethereum,
  //   rootChain: ROOTCHAIN_ADDRESS,
  //   posRootChainManager: ROOTCHAINMANAGER_ADDRESS,
  // });

  domainArray[0].verifyingContract = CHILD_TOKEN_ADDRESS_MANA; // verifying contract for Biconomy Token contract
  domainArray[1].verifyingContract = TREASURY_CONTRACT_ADDRESS; // verifying contract for Biconomy Treasury contract

  return {
    WORKER_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    TREASURY_CONTRACT_ADDRESS,

    // TREASURY_SLOTS_ADDRESS,
    // TREASURY_ROULETTE_ADDRESS,
    // TREASURY_BACKGAMMON_ADDRESS,
    // TREASURY_BLACKJACK_ADDRESS,
    // ROOTCHAIN_ADDRESS,
    // ROOTCHAINMANAGER_ADDRESS,
  };
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// return token contract for Biconomy API meta-transaction calls
function getTokenContract(network, web3Default) {
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
// return treasury contract for Biconomy API meta-transaction calls
function getTreasuryContract(web3Default) {
  let treasuryContract;

  treasuryContract = new web3Default.eth.Contract(
    ABIs.TREASURY_CONTRACT,
    TREASURY_CONTRACT_ADDRESS
  );

  return treasuryContract;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get user or contract token balance from MetaMask
function balanceOfToken(tokenContract, userOrContractAddress) {
  return new Promise(async (resolve, reject) => {
    console.log('Get balance of token');

    try {
      tokenContract.balanceOf(userOrContractAddress, async function (
        err,
        amount
      ) {
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
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get allocated tokens for specified game
function getTokensGame(gameIndex, tokenIndex, web3Default) {
  return new Promise(async (resolve, reject) => {
    console.log('Get tokens per game');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIs.TREASURY_CONTRACT)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.checkGameTokens(gameIndex, tokenIndex, async function (
        err,
        amount
      ) {
        if (err) {
          console.log('Get tokens per game failed', err);
          reject(false);
        }
        console.log('Get tokens per game done');

        const amountAdjusted = (amount / FACTOR)
          .toFixed(DECIMAL_PLACES)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        resolve(amountAdjusted);
      });
    } catch (error) {
      console.log('Get tokens per game failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// deposit funds to parent contract
function depositToParent(gameType, tokenID, amount, userAddress, web3Default) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit start: ' + amount);

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIs.TREASURY_CONTRACT)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.addFunds(
        gameType,
        tokenID,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex(GAS_AMOUNT),
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
function withdrawFromParent(
  gameType,
  amount,
  tokenName,
  userAddress,
  web3Default
) {
  return new Promise(async (resolve, reject) => {
    console.log('Withdraw start: ' + amount);

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIs.TREASURY_CONTRACT)
        .at(TREASURY_CONTRACT_ADDRESS);

      PARENT_CONTRACT.withdrawCollateral(
        gameType,
        amount,
        tokenName,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex(GAS_AMOUNT),
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
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// execute functions on Matic Network from Mainnet using Biconomy PoS meta-transactions API
function executeMetaTransaction(
  i,
  functionSignature,
  sessionDuration,
  tokenContract,
  userAddress,
  web3Default
) {
  return new Promise(async (resolve, reject) => {
    console.log('Execute Biconomy PoS meta-transaction');
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Chain ID: ' + domainArray[i].chainId);
    console.log('Verify contract: ' + domainArray[i].verifyingContract);

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
        domain: domainArray[i],
        primaryType: 'MetaTransaction',
        message: message,
      });

      console.log('Domain data: ');
      console.log(domainArray[i]);

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

          let ret;

          try {
            if (i === 0) {
              ret = await tokenContract.methods
                .executeMetaTransaction(userAddress, functionSignature, r, s, v)
                .send({
                  from: userAddress,
                });
            } else if (i === 1) {
              ret = await tokenContract.methods
                .executeMetaTransaction(
                  userAddress,
                  functionSignature,
                  sessionDuration,
                  r,
                  s,
                  v
                )
                .send({
                  from: userAddress,
                });
            }

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

function getSignatureParameters(signature, web3Default) {
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
// function getConfirmedTx(txHash, web3Default) {
//   return new Promise(async (resolve, reject) => {
//     let finish = false;

//     while (!finish) {
//       web3Default.eth.getTransactionReceipt(txHash, (err, res) => {
//         if (err) {
//           finish = true;
//           reject(err);
//         }
//         if (res) {
//           finish = true;
//           resolve(res);
//         }
//       });

//       const delay = (ms) => new Promise((res) => setTimeout(res, ms));
//       await delay(2000);
//     }
//   });
// }

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
  ACTIVE_PERIOD,
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
  FETCH,
  getTokenContract,
  getTreasuryContract,
  balanceOfToken,
  // getAllowedToken,
  // approveToken,
  // depositTokenToMatic,
  // exitToMainnet,
  // getBalanceParent,
  getTokensGame,
  depositToParent,
  withdrawFromParent,
  executeMetaTransaction,
  // getConfirmedTx,
  // fetchUserStatus,
  // fetchCountryCode,
  // fetchParcelData,
  // fetchHistoryData,
  // fetchPlayData,
  // fetchGameRecords,
  // fetchUserNumbers,
  // postUserVerify,
  // postHistory,
};
