// import sigUtil from 'eth-sig-util';
import ABIRootChain from './ABI/ABIRootChain';
// import ABIFAKEMana from './ABI/ABIFAKEMana';
import ABIDepositManager from './ABI/ABIDepositManager';
import ABIParent from './ABI/ABIParent';
// import RootChain from './ABI/RootChain';
import MANASlots from './ABI/ABISlotsMANA'; // ***
import StandardToken from './ABI/StandardToken';
import DepositManager from './ABI/DepositManager';
import WithdrawManager from './ABI/WithdrawManager';
import ChildERC20Token from './ABI/ChildERC20Token';

require('dotenv').config({ path: '.env.website' });

//const API_BASE_URL = 'https://api.decentral.games';
//const BASE_URL = 'https://decentralserver.herokuapp.com';
// const BASE_URL = "http://localhost:5000";
const API_BASE_URL = process.env.API_BASE_URL;
const BASE_URL = process.env.BASE_URL;

let WORKER_WALLET_ADDRESS;
let PARENT_CONTRACT_ADDRESS;
let ADMIN_ADDR;
let RELAY_ADDR;
let MASTER_CONTRACT_ADDRESS;
let SLOTS_CONTRACT_ADDRESS;
let ROULETTE_CONTRACT_ADDRESS;

async function init() {
  const response = await getAddresses();
  let json = await response.json();

  WORKER_WALLET_ADDRESS = await json.WORKER_WALLET_ADDRESS;
  PARENT_CONTRACT_ADDRESS = await json.PARENT_CONTRACT_ADDRESS;

  console.log('WORKER_WALLET_ADDRESS: ' + WORKER_WALLET_ADDRESS);
  console.log('PARENT_CONTRACT_ADDRESS: ' + PARENT_CONTRACT_ADDRESS);

  ADMIN_ADDR = [
    '0xa7C825BB8c2C4d18288af8efe38c8Bf75A1AAB51'.toLowerCase(),
    '0xDd2d884Cf91ad8b72A78dCD5a25a8a2b29D78f28'.toLowerCase(),
    '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
    // '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'.toLowerCase(),
    WORKER_WALLET_ADDRESS.toLowerCase(),
    '0xfbA3346f93172C3d2d138dccc48873aCC2fea331'.toLowerCase(),
  ];
  // RELAY_ADDR = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A'.toLowerCase();
  RELAY_ADDR = WORKER_WALLET_ADDRESS.toLowerCase();
  MASTER_CONTRACT_ADDRESS = PARENT_CONTRACT_ADDRESS.toLowerCase(); // Matic address
  SLOTS_CONTRACT_ADDRESS = MASTER_CONTRACT_ADDRESS; // Matic address
  ROULETTE_CONTRACT_ADDRESS = MASTER_CONTRACT_ADDRESS; // Matic address
}
init(); // fetch the WORKER wallet and PARENT CONTRACT addresses from server

function getAddresses() {
  return fetch(`${BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

const ADMINS = [
  '0xa7C825BB8c2C4d18288af8efe38c8Bf75A1AAB51'.toLowerCase(),
  '0xDf4eC4dAdCCAbBE4bC44C5D3597abBA54B18Df45'.toLowerCase(),
  '0xfbA3346f93172C3d2d138dccc48873aCC2fea331'.toLowerCase(),
];

// const Buffer = window.ethereumjs.Buffer.Buffer;
// const Util = window.ethereumjs.Util;
// const RLP = window.ethereumjs.RLP;

const FACTOR = 1000000000000000000; // ETH/WEI multiplication factor

const ROPSTEN_TOKEN = process.env.ROPSTEN_TOKEN; //Ropsten MANA Token
const MATIC_TOKEN = process.env.MATIC_TOKEN; // Matic mapped MANA Token
const TOKEN_DECIMALS = process.env.TOKEN_DECIMALS;
const ROOTCHAIN_ADDRESS = process.env.ROOTCHAIN_ADDRESS; //test
// const ROOTCHAIN_ADDRESS = '0xA4edab1eF6358c40D487a9D466D977e98F7AC218'.toLowerCase();  //main
const DEPOSITMANAGER_ADDRESS = process.env.DEPOSITMANAGER_ADDRESS; //test
// const DEPOSITMANAGER_ADDRESS = '0xe60eb6A559eec79f65f2207366D32A68fD171944'.toLowerCase();  //main
const WITHDRAWMANAGER_ADDRESS = process.env.WITHDRAWMANAGER_ADDRESS; //test
// const WITHDRAWMANAGER_ADDRESS = '0x4D67F2e7Be1807D76D5E55e21Af6300ad35c19e9'.toLowerCase();  //main
const SYNCER_URL = process.env.SYNCER_URL;
const WATCHER_URL = process.env.WATCHER_URL;
const MAX_AMOUNT = process.env.MAX_AMOUNT;
const GAS_LIMIT = process.env.GAS_LIMIT;
const MATIC_NETWORK_ID = process.env.MATIC_NETWORK_ID; //test

// const MATIC_URL = 'https://testnet2.matic.network';
const MATIC_URL = 'https://testnetv3.matic.network';
const MATIC_EXPLORER = 'https://testnetv3-explorer.matic.network'; // 'https://explorer.testnet2.matic.network';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function _apiCall(data = {}) {
  const headers = data.headers || {};

  const queryParams =
    data.query &&
    Object.keys(data.query || {})
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data.query[k]);
      })
      .join('&');

  const url = `${data.url}?${queryParams || ''}`;

  return fetch(url, {
    method: data.method || (data.body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: data.body ? JSON.stringify(data.body) : null,
  }).then((res) => {
    if (!res.ok) {
      const err = new Error(res.statusText || 'Unknown error occurred');
      err.response = res;
      throw err;
    }
    return res.json();
  });
}

async function getTxProof(txId) {
  const { proof: txProof } = await _apiCall({
    url: `${SYNCER_URL}/tx/${txId}/proof`,
  });

  return txProof;
}

async function getReceiptProof(txId) {
  const { proof: receiptProof } = await _apiCall({
    url: `${SYNCER_URL}/tx/${txId}/receipt/proof`,
  });

  return receiptProof;
}

function getHeaderObject(blockNumber) {
  return _apiCall({
    url: `${WATCHER_URL}/header/included/${blockNumber}`,
  });
}

async function getHeaderProof(blockNumber, header) {
  const { proof: headerProof } = await _apiCall({
    url: `${SYNCER_URL}/block/${blockNumber}/proof`,
    query: {
      start: +header.start,
      end: +header.end,
    },
  });

  return headerProof;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get user token balance from MetaMask
function balanceOfToken(
  tokenAddress,
  web3Default = window.web3,
  userAddress = window.web3.currentProvider.selectedAddress
) {
  return new Promise(async (resolve, reject) => {
    console.log('getting balance of Token');

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(StandardToken.abi)
        .at(tokenAddress);

      // const TOKEN_CONTRACT = web3.eth
      //   .contract(StandardToken.abi)
      //   .at(tokenAddress);

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
function getAllowedToken(
  tokenAddress,
  contractAddress,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('get allowed tokens');

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(StandardToken.abi)
        .at(tokenAddress);

      TOKEN_CONTRACT.allowance(userAddress, contractAddress, async function (
        err,
        amount
      ) {
        if (err) {
          console.log('get allowed failed', err);
          reject(false);
        }

        resolve(amount);
      });
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
  tokenAddress,
  amount,
  contractAddress,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('Approving contract');

    console.log('token address: ' + tokenAddress);
    console.log('amount: ' + amount);
    console.log('contract addres: ' + contractAddress);
    console.log('user address: ' + userAddress);
    console.log(web3Default);

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(StandardToken.abi)
        .at(tokenAddress);

      console.log(TOKEN_CONTRACT);

      TOKEN_CONTRACT.approve(
        contractAddress,
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
  tokenAddress,
  amount,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit start');

    console.log(tokenAddress);
    console.log(amount);
    console.log(userAddress);
    // console.log(web3);

    console.log(DEPOSITMANAGER_ADDRESS);

    try {
      // const ROOTCHAIN_CONTRACT = web3.eth
      //   .contract(RootChain.abi)
      //   .at(ROOTCHAIN_ADDRESS);

      const DEPOSITMANAGER_CONTRACT = web3Default.eth
        .contract(ABIDepositManager)
        .at(DEPOSITMANAGER_ADDRESS);

      // ROOTCHAIN_CONTRACT.deposit(

      DEPOSITMANAGER_CONTRACT.depositERC20ForUser(
        tokenAddress,
        userAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT * 20),
          gasPrice: web3Default.toHex('80000000000'),
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
    console.log('Deposit start' + ': ' + amount);
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
function depositTokenToMANASlots(amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log('Deposit start');
    try {
      const MANASLOTS_CONTRACT = window.web3.eth
        .contract(MANASlots.abi)
        .at(SLOTS_CONTRACT_ADDRESS);
      MANASLOTS_CONTRACT.addFunds(
        amount,
        {
          from: user_address,
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

function withdrawTokenFromMANASlots(amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log('Withdraw start');
    try {
      const MANASLOTS_CONTRACT = window.web3.eth
        .contract(MANASlots.abi)
        .at(SLOTS_CONTRACT_ADDRESS);
      MANASLOTS_CONTRACT.withdrawFunds(
        amount,
        {
          from: user_address,
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

function startWithdrawTokenFromMatic(token, amount, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log('Withdraw starting');
    try {
      const TOKEN_CONTRACT = window.web3.eth
        .contract(ChildERC20Token.abi)
        .at(token);
      TOKEN_CONTRACT.withdraw(
        amount,
        {
          from: user_address,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex('20000000000'),
        },
        async function (err, hash) {
          if (err) {
            console.log('Withdraw starting failed', err);
            reject(false);
          }

          var ret = await getConfirmedTx(hash);
          if (ret.status == '0x0') {
            console.log('Withdraw starting transaction failed');
            resolve(false);
          } else {
            console.log('Withdraw starting done');
            resolve(hash);
          }
        }
      );
    } catch (error) {
      console.log('Withdraw starting failed', error);
      reject(false);
    }
  });
}

// function withdrawTokenFromMatic(txId, user_address) {
//   return new Promise(async (resolve, reject) => {
//     console.log('Withdrawing');
//     try {
//       // fetch trancation & receipt proof
//       const [txProof, receiptProof] = await Promise.all([
//         getTxProof(txId),
//         getReceiptProof(txId),
//       ]);

//       // fetch header object & header proof
//       let header = null;
//       try {
//         header = await getHeaderObject(txProof.blockNumber);
//       } catch (e) {
//         // ignore error
//       }

//       // check if header block found
//       if (!header) {
//         throw new Error(
//           `No corresponding checkpoint/header block found for ${txId}.`
//         );
//       }

//       const headerProof = await getHeaderProof(txProof.blockNumber, header);
//       const WITHDRAWMANAGER_CONTRACT = window.web3.eth
//         .contract(WithdrawManager.abi)
//         .at(WITHDRAWMANAGER_ADDRESS);
//       console.log(headerProof);
//       console.log(txProof);
//       console.log(receiptProof);
//       WITHDRAWMANAGER_CONTRACT.withdrawBurntTokens(
//         header.number,
//         Util.bufferToHex(
//           Buffer.concat(headerProof.proof.map((p) => Util.toBuffer(p)))
//         ), // header proof
//         txProof.blockNumber, // block number
//         txProof.blockTimestamp, // block timestamp
//         txProof.root, // tx root
//         receiptProof.root, // receipt root
//         Util.bufferToHex(RLP.encode(receiptProof.path)), // key for trie (both tx and receipt)
//         txProof.value, // tx bytes
//         txProof.parentNodes, // tx proof nodes
//         receiptProof.value, // receipt bytes
//         receiptProof.parentNodes,
//         {
//           // reciept proof nodes
//           from: user_address,
//           gasLimit: window.web3.toHex(GAS_LIMIT),
//           gasPrice: window.web3.toHex('20000000000'),
//         },
//         async function (err, hash) {
//           if (err) {
//             console.log('Withdrawing failed', err);
//             reject(false);
//           }

//           var ret = await getConfirmedTx(hash);
//           if (ret.status == '0x0') {
//             console.log('Withdrawing transaction failed');
//             resolve(false);
//           } else {
//             console.log('Withdrawing done');
//             resolve(hash);
//           }
//         }
//       );
//     } catch (error) {
//       console.log('Withdrawing failed', error);
//       reject(false);
//     }
//   });
// }

async function processExits(rootTokenAddress, user_address) {
  return new Promise(async (resolve, reject) => {
    console.log('Withdrawing exit');
    try {
      const WITHDRAWMANAGER_CONTRACT = window.web3.eth
        .contract(WithdrawManager.abi)
        .at(WITHDRAWMANAGER_ADDRESS);
      WITHDRAWMANAGER_CONTRACT.processExits(
        rootTokenAddress,
        {
          from: user_address,
          gasLimit: window.web3.toHex(GAS_LIMIT),
          gasPrice: window.web3.toHex('20000000000'),
        },
        async function (err, hash) {
          if (err) {
            console.log('Withdraw exit failed', err);
            reject(false);
          }

          var ret = await getConfirmedTx(hash);
          if (ret.status == '0x0') {
            console.log('Withdraw exit transaction failed');
            resolve(false);
          } else {
            console.log('Withdraw exit done');
            resolve(hash);
          }
        }
      );
    } catch (error) {
      console.log('Withdrawing exit', error);
      reject(false);
    }
  });
}

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

function getMappedToken(token) {
  return new Promise(async (resolve, reject) => {
    console.log('getting Mapped Token');
    try {
      const DEPOSIT_CONTRACT = window.web3.eth
        .contract(DepositManager.abi)
        .at(DEPOSITMANAGER_ADDRESS);
      DEPOSIT_CONTRACT.tokens(token, async function (err, address) {
        if (err) {
          console.log('getting failed', err);
          reject(false);
        }

        resolve(address);
      });
    } catch (error) {
      console.log('getting failed', error);
      reject(false);
    }
  });
}

export default {
  ADMIN_ADDR: () => ADMIN_ADDR,
  RELAY_ADDR: () => RELAY_ADDR,
  API_BASE_URL,
  BASE_URL,
  FACTOR,
  ROPSTEN_TOKEN,
  MATIC_TOKEN,
  SLOTS_CONTRACT_ADDRESS: () => SLOTS_CONTRACT_ADDRESS,
  ROULETTE_CONTRACT_ADDRESS: () => ROULETTE_CONTRACT_ADDRESS,
  MASTER_CONTRACT_ADDRESS: () => MASTER_CONTRACT_ADDRESS,
  TOKEN_DECIMALS,
  ROOTCHAIN_ADDRESS,
  DEPOSITMANAGER_ADDRESS,
  MATIC_NETWORK_ID,
  MATIC_URL,
  MATIC_EXPLORER,
  SYNCER_URL,
  WATCHER_URL,
  MAX_AMOUNT,
  GAS_LIMIT,
  delay,
  getConfirmedTx,
  balanceOfToken,
  getAllowedToken,
  approveToken,
  depositTokenToMatic,
  getBalanceParent,
  getTokensGame,
  depositToParent,
  withdrawFromParent,
  depositTokenToMANASlots,
  withdrawTokenFromMANASlots,
  getMappedToken,
  startWithdrawTokenFromMatic,
  // withdrawTokenFromMatic,
  processExits,
};
