import ABIParent from './ABI/ABIParent';
// import StandardToken from './ABI/StandardToken';
import ABIFAKEMana from './ABI/ABIFAKEMana';

const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient;

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set global constant values
const API_BASE_URL = 'https://api.decentral.games';
const BASE_URL = 'https://api.decentral.games';
// const SYNCER_URL = 'https://matic-syncer2.api.matic.network/api/v1';
// const WATCHER_URL = 'https://ropsten-watcher2.api.matic.network/api/v1';
const MAX_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
const GAS_LIMIT = '900000';
const FACTOR = 1000000000000000000; // ETH-to-WEI multiplication factor
const PARENT_NETWORK_ID = 3; // 1: main net, 3: Ropsten
const MATIC_NETWORK_ID = '15001';
const MATIC_URL = 'https://testnetv3.matic.network';
const MATIC_EXPLORER = 'https://testnetv3-explorer.matic.network';
const ADMIN_ADDR = [
  '0xa7C825BB8c2C4d18288af8efe38c8Bf75A1AAB51'.toLowerCase(),
  '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase(),
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
  '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'.toLowerCase(),
  '0xfbA3346f93172C3d2d138dccc48873aCC2fea331'.toLowerCase(),
];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// fetch wallet and contract addresses from server REST API
let RELAY_ADDR = '';
let MAINNET_TOKEN_ADDRESS = '';
let ROPSTEN_TOKEN_ADDRESS = '';
let MATIC_TOKEN_ADDRESS = '';
let MASTER_CONTRACT_ADDRESS = '';
let TREASURY_SLOTS_ADDRESS = '';
let TREASURY_ROULETTE_ADDRESS = '';
let TREASURY_BACKGAMMON = '';
let TREASURY_BLACKJACK = '';
let ROOTCHAIN_ADDRESS = '';
//let DEPOSITMANAGER_ADDRESS = ''; // ***********
let ROOTCHAINMANAGER_ADDRESS = '';
let WITHDRAWMANAGER_ADDRESS = '';

let maticPOSClient;

async function init() {
  const response = await getAddresses();
  let json = await response.json();

  RELAY_ADDR = await json.WORKER_WALLET_ADDRESS; // *************
  MAINNET_TOKEN_ADDRESS = await json.MAINNET_TOKEN_ADDRESS;

  // ROPSTEN_TOKEN_ADDRESS = '0x5217e41200508b5A208A8D8736602d637213F827'; // await json.ROPSTEN_TOKEN_ADDRESS;
  ROPSTEN_TOKEN_ADDRESS = '0x3486DC2Bf6d45Da6E0bb96a9999a4744F9a6B421'; // await json.ROPSTEN_TOKEN_ADDRESS;

  // MATIC_TOKEN_ADDRESS = await json.MATIC_TOKEN_ADDRESS;
  MATIC_TOKEN_ADDRESS = '0xb6e5aaaE04acb59f2e7D951a9bC31855Ca2813aD';

  MASTER_CONTRACT_ADDRESS = await json.PARENT_CONTRACT_ADDRESS; // **************
  TREASURY_SLOTS_ADDRESS = await json.TREASURY_SLOTS_ADDRESS;
  TREASURY_ROULETTE_ADDRESS = await json.TREASURY_ROULETTE_ADDRESS;
  TREASURY_BACKGAMMON = await json.TREASURY_BACKGAMMON;
  TREASURY_BLACKJACK = await json.TREASURY_BLACKJACK;
  ROOTCHAIN_ADDRESS = await json.ROOTCHAIN_ADDRESS;
  // DEPOSITMANAGER_ADDRESS = await json.DEPOSITMANAGER_ADDRESS; // ***********
  ROOTCHAINMANAGER_ADDRESS = '0xC5C4a4086FE913b5D525915404C88d12b4031CC0';
  WITHDRAWMANAGER_ADDRESS = await json.WITHDRAWMANAGER_ADDRESS;

  console.log('RELAY_ADDRESS (WORKER): ' + RELAY_ADDR);
  console.log('MAINNET_TOKEN_ADDRESS: ' + MAINNET_TOKEN_ADDRESS);
  console.log('ROPSTEN_TOKEN_ADDRESS: ' + ROPSTEN_TOKEN_ADDRESS);
  console.log('MATIC_TOKEN_ADDRESS: ' + MATIC_TOKEN_ADDRESS);
  console.log('MASTER_CONTRACT_ADDRESS: ' + MASTER_CONTRACT_ADDRESS);
  console.log('TREASURY_SLOTS_ADDRESS: ' + TREASURY_SLOTS_ADDRESS);
  console.log('TREASURY_ROULETTE_ADDRESS: ' + TREASURY_ROULETTE_ADDRESS);
  console.log('TREASURY_BACKGAMMON: ' + TREASURY_BACKGAMMON);
  console.log('TREASURY_BLACKJACK: ' + TREASURY_BLACKJACK);
  console.log('ROOTCHAIN_ADDRESS: ' + ROOTCHAIN_ADDRESS);
  // console.log('DEPOSITMANAGER_ADDRESS: ' + DEPOSITMANAGER_ADDRESS); // *******************
  console.log('ROOTCHAINMANAGER_ADDRESS: ' + ROOTCHAINMANAGER_ADDRESS);
  console.log('WITHDRAWMANAGER_ADDRESS: ' + WITHDRAWMANAGER_ADDRESS);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // create MaticPOSClient object to deposit tokens from Main net to Matic Network
  maticPOSClient = new MaticPOSClient({
    maticProvider: MATIC_URL, // config.MATIC_PROVIDER,
    parentProvider: window.ethereum, // web3.currentProvider, // config.PARENT_PROVIDER,
    rootChain: ROOTCHAIN_ADDRESS,
    posRootChainManager: '0xC5C4a4086FE913b5D525915404C88d12b4031CC0', // config.POS_ROOT_CHAIN_MANAGER_ADDRESS,
  });

  // maticProvider: config.MATIC_PROVIDER,
  // parentProvider: window.ethereum,
  // rootChain: PLASMA_ROOT_CHAIN_ADDRESS,
  // posRootChainManager: ROOT_CHAIN_MANAGER_ADDRESS,
}
init();

function getAddresses() {
  return fetch(`${BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// fetch syncer and watcher data
// function _apiCall(data = {}) {
//   const headers = data.headers || {};

//   const queryParams =
//     data.query &&
//     Object.keys(data.query || {})
//       .map(function (k) {
//         return encodeURIComponent(k) + '=' + encodeURIComponent(data.query[k]);
//       })
//       .join('&');

//   const url = `${data.url}?${queryParams || ''}`;

//   return fetch(url, {
//     method: data.method || (data.body ? 'POST' : 'GET'),
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       ...headers,
//     },
//     body: data.body ? JSON.stringify(data.body) : null,
//   }).then((res) => {
//     if (!res.ok) {
//       const err = new Error(res.statusText || 'Unknown error occurred');
//       err.response = res;
//       throw err;
//     }
//     return res.json();
//   });
// }

// async function getTxProof(txId) {
//   const { proof: txProof } = await _apiCall({
//     url: `${SYNCER_URL}/tx/${txId}/proof`,
//   });

//   return txProof;
// }

// async function getReceiptProof(txId) {
//   const { proof: receiptProof } = await _apiCall({
//     url: `${SYNCER_URL}/tx/${txId}/receipt/proof`,
//   });

//   return receiptProof;
// }

// function getHeaderObject(blockNumber) {
//   return _apiCall({
//     url: `${WATCHER_URL}/header/included/${blockNumber}`,
//   });
// }

// async function getHeaderProof(blockNumber, header) {
//   const { proof: headerProof } = await _apiCall({
//     url: `${SYNCER_URL}/block/${blockNumber}/proof`,
//     query: {
//       start: +header.start,
//       end: +header.end,
//     },
//   });

//   return headerProof;
// }

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get user or contract token balance from MetaMask
function balanceOfToken(
  tokenName,
  web3Default = window.web3,
  userAddress = window.web3.currentProvider.selectedAddress
) {
  let tokenAddress = '';
  if (tokenName == 'ropsten') {
    tokenAddress = ROPSTEN_TOKEN_ADDRESS;
  } else if (tokenName == 'matic') {
    tokenAddress = MATIC_TOKEN_ADDRESS;
  }

  return new Promise(async (resolve, reject) => {
    console.log('getting balance of Token');

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(ABIFAKEMana) // StandardToken.abi
        .at(tokenAddress);

      TOKEN_CONTRACT.balanceOf(userAddress, async function (err, amount) {
        if (err) {
          console.log('getting failed', err);
          reject(false);
        }

        resolve(amount);
      });
    } catch (error) {
      console.log('getting failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// returns the amount of MANA contractAddress is approved to spend on behalf of the user
function getAllowedToken(tokenName, userAddress, web3Default = window.web3) {
  let tokenAddress = '';
  if (tokenName == 'ropsten') {
    tokenAddress = ROPSTEN_TOKEN_ADDRESS;
  } else if (tokenName == 'matic') {
    tokenAddress = MATIC_TOKEN_ADDRESS;
  }

  return new Promise(async (resolve, reject) => {
    console.log('get allowed tokens');

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(ABIFAKEMana) // StandardToken.abi
        .at(tokenAddress);

      TOKEN_CONTRACT.allowance(
        userAddress,
        ROOTCHAINMANAGER_ADDRESS,
        async function (err, amount) {
          if (err) {
            console.log('get allowed failed', err);
            reject(false);
          }

          resolve(amount);
        }
      );
    } catch (error) {
      console.log('get allowed failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// allows contractAddress to spend given amount of tokens on user's behalf
async function approveToken(
  tokenName,
  amount,
  userAddress,
  web3Default = window.web3
) {
  let tokenAddress = '';
  if (tokenName == 'ropsten') {
    tokenAddress = ROPSTEN_TOKEN_ADDRESS;
  } else if (tokenName == 'matic') {
    tokenAddress = MATIC_TOKEN_ADDRESS;
  }

  return new Promise(async (resolve, reject) => {
    console.log('Approving contract');

    console.log('token address: ' + tokenAddress);
    console.log('amount: ' + amount);
    console.log('user address: ' + userAddress);
    console.log(web3Default);

    try {
      maticPOSClient.approveERC20ForDeposit(
        tokenAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex('20000000000'),
        },
        async function (err, hash) {
          if (err) {
            console.log('Approving failed 1: ', err);

            reject(false);
          }

          const ret = await getConfirmedTx(hash);
          if (ret.status == '0x0') {
            console.log('Approving transaction failed');
            reject(false);
          } else {
            console.log('Approving done');

            resolve(true);
          }
        }
      );
    } catch (error) {
      console.log('Approving failed 2: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// deposit MANA from the Matic Root contract to Matic Network
async function depositTokenToMatic(
  tokenName,
  amount,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    let tokenAddress = '';
    if (tokenName == 'ropsten') {
      tokenAddress = ROPSTEN_TOKEN_ADDRESS;
    } else if (tokenName == 'matic') {
      tokenAddress = MATIC_TOKEN_ADDRESS;
    }

    console.log('Deposit start');

    console.log('token address: ' + tokenAddress);
    console.log('amount: ' + amount);
    console.log('user address: ' + userAddress);
    console.log('rootchain manager address: ' + ROOTCHAINMANAGER_ADDRESS);
    console.log('gass limit: ' + GAS_LIMIT);

    try {
      console.log('amount..');
      console.log(amount);

      maticPOSClient.depositERC20ForUser(
        tokenAddress,
        userAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex('20000000000'),
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
// get balance from parent contract and allocated tokens from slots and roulette games
function getBalanceParent(tokenName, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('get balance start');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIParent)
        .at(MASTER_CONTRACT_ADDRESS);

      PARENT_CONTRACT.getBalanceByTokenName(tokenName, async function (
        err,
        amount
      ) {
        if (err) {
          console.log('getting balance failed', err);
          reject(false);
        }

        resolve(amount);
      });
    } catch (error) {
      console.log('getting balance failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get allocated tokens for specified game
function getTokensGame(gameType, tokenName, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('get tokens per game start');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIParent)
        .at(MASTER_CONTRACT_ADDRESS);

      PARENT_CONTRACT.checkAllocatedTokensPerGame(
        gameType,
        tokenName,
        async function (err, amount) {
          if (err) {
            console.log('getting tokens per game failed', err);
            reject(false);
          }

          resolve(amount);
        }
      );
    } catch (error) {
      console.log('getting tokens per game failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// deposit funds to parent contract
function depositToParent(gameType, amount, tokenName) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit start' + amount);
    const userAddress = window.web3.currentProvider.selectedAddress;

    try {
      const PARENT_CONTRACT = window.web3.eth
        .contract(ABIParent)
        .at(MASTER_CONTRACT_ADDRESS);

      PARENT_CONTRACT.addFunds(
        gameType,
        amount,
        tokenName,
        {
          from: userAddress,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex('20000000000'),
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
    console.log('Withdraw start' + ': ' + amount);
    const userAddress = window.web3.currentProvider.selectedAddress;

    try {
      const PARENT_CONTRACT = window.web3.eth
        .contract(ABIParent)
        .at(MASTER_CONTRACT_ADDRESS);

      PARENT_CONTRACT.withdrawCollateral(
        gameType,
        amount,
        tokenName,
        {
          from: userAddress,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex('20000000000'),
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
// return confirmation hash
function getConfirmedTx(txHash) {
  return new Promise(async (resolve, reject) => {
    var finish = false;

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

      await delay(2000);
    }
  });
}

// function getMappedToken(token) {
//   return new Promise(async (resolve, reject) => {
//     console.log('getting Mapped Token');
//     try {
//       const DEPOSIT_CONTRACT = window.web3.eth
//         .contract(DepositManager.abi)
//         .at(DEPOSITMANAGER_ADDRESS);
//       DEPOSIT_CONTRACT.tokens(token, async function (err, address) {
//         if (err) {
//           console.log('getting failed', err);
//           reject(false);
//         }

//         resolve(address);
//       });
//     } catch (error) {
//       console.log('getting failed', error);
//       reject(false);
//     }
//   });
// }

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export default {
  ADMIN_ADDR,
  RELAY_ADDR,
  API_BASE_URL,
  BASE_URL,
  FACTOR,
  ROPSTEN_TOKEN_ADDRESS,
  MATIC_TOKEN_ADDRESS,
  MASTER_CONTRACT_ADDRESS,
  TREASURY_SLOTS_ADDRESS,
  TREASURY_ROULETTE_ADDRESS,
  ROOTCHAIN_ADDRESS,
  // DEPOSITMANAGER_ADDRESS,
  PARENT_NETWORK_ID,
  MATIC_NETWORK_ID,
  MATIC_URL,
  MATIC_EXPLORER,
  MAX_AMOUNT,
  delay,
  getConfirmedTx,
  balanceOfToken,
  getAllowedToken,
  approveToken,
  getBalanceParent,
  getTokensGame,
  depositToParent,
  withdrawFromParent,
  depositTokenToMatic,
};
