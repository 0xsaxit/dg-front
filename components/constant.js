import ABIParent from './ABI/ABIParent';
import ABIFAKEMana from './ABI/ABIFAKEMana';
import { MaticPOSClient } from '@maticnetwork/maticjs';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// set global constant values
const API_BASE_URL = 'https://api.decentral.games';
const BASE_URL = 'https://api.decentral.games';
const MAX_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
const GAS_LIMIT = '900000';
const FACTOR = 1000000000000000000; // ETH-to-WEI multiplication factor
const PARENT_NETWORK_ID = 3; // 1: main net, 3: Ropsten
const MATIC_NETWORK_ID = '15001';
const MATIC_URL = 'https://testnetv3.matic.network';
const MATIC_EXPLORER = 'https://testnetv3-explorer.matic.network';
const ADMIN_ADDRESSES = [
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
let RELAY_ADDRESS = '';
let MAINNET_TOKEN_ADDRESS = '';
let ROPSTEN_TOKEN_ADDRESS = '';
let MATIC_TOKEN_ADDRESS = '';
let PARENT_CONTRACT_ADDRESS = '';
let TREASURY_SLOTS_ADDRESS = '';
let TREASURY_ROULETTE_ADDRESS = '';
let TREASURY_BACKGAMMON = '';
let TREASURY_BLACKJACK = '';
let ROOTCHAIN_ADDRESS = '';
let ROOTCHAINMANAGER_ADDRESS = '';
let WITHDRAWMANAGER_ADDRESS = '';
let maticPOSClient;

async function init() {
  const response = await getAddresses();
  let json = await response.json();

  RELAY_ADDRESS = await json.WORKER_WALLET_ADDRESS;
  MAINNET_TOKEN_ADDRESS = await json.MAINNET_TOKEN_ADDRESS;
  ROPSTEN_TOKEN_ADDRESS = await json.ROPSTEN_TOKEN_ADDRESS; // '0x3486DC2Bf6d45Da6E0bb96a9999a4744F9a6B421'; //
  MATIC_TOKEN_ADDRESS = await json.MATIC_TOKEN_ADDRESS; // '0xb6e5aaaE04acb59f2e7D951a9bC31855Ca2813aD'; //
  PARENT_CONTRACT_ADDRESS = await json.PARENT_CONTRACT_ADDRESS;
  TREASURY_SLOTS_ADDRESS = await json.TREASURY_SLOTS_ADDRESS;
  TREASURY_ROULETTE_ADDRESS = await json.TREASURY_ROULETTE_ADDRESS;
  TREASURY_BACKGAMMON = await json.TREASURY_BACKGAMMON;
  TREASURY_BLACKJACK = await json.TREASURY_BLACKJACK;
  ROOTCHAIN_ADDRESS = await json.ROOTCHAIN_ADDRESS;
  ROOTCHAINMANAGER_ADDRESS = json.ROOTCHAINMANAGER_ADDRESS; // '0xC5C4a4086FE913b5D525915404C88d12b4031CC0';
  WITHDRAWMANAGER_ADDRESS = await json.WITHDRAWMANAGER_ADDRESS;

  console.log('RELAY_ADDRESS (WORKER): ' + RELAY_ADDRESS);
  console.log('MAINNET_TOKEN_ADDRESS: ' + MAINNET_TOKEN_ADDRESS);
  console.log('ROPSTEN_TOKEN_ADDRESS: ' + ROPSTEN_TOKEN_ADDRESS);
  console.log('MATIC_TOKEN_ADDRESS: ' + MATIC_TOKEN_ADDRESS);
  console.log('PARENT_CONTRACT_ADDRESS: ' + PARENT_CONTRACT_ADDRESS);
  console.log('TREASURY_SLOTS_ADDRESS: ' + TREASURY_SLOTS_ADDRESS);
  console.log('TREASURY_ROULETTE_ADDRESS: ' + TREASURY_ROULETTE_ADDRESS);
  console.log('TREASURY_BACKGAMMON: ' + TREASURY_BACKGAMMON);
  console.log('TREASURY_BLACKJACK: ' + TREASURY_BLACKJACK);
  console.log('ROOTCHAIN_ADDRESS: ' + ROOTCHAIN_ADDRESS);
  console.log('ROOTCHAINMANAGER_ADDRESS: ' + ROOTCHAINMANAGER_ADDRESS);
  console.log('WITHDRAWMANAGER_ADDRESS: ' + WITHDRAWMANAGER_ADDRESS);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // create MaticPOSClient object to deposit tokens from Main net to Matic Network
  maticPOSClient = new MaticPOSClient({
    maticProvider: MATIC_URL, // config.MATIC_PROVIDER,
    parentProvider: window.ethereum, // web3.currentProvider, // config.PARENT_PROVIDER,
    rootChain: ROOTCHAIN_ADDRESS,
    posRootChainManager: ROOTCHAINMANAGER_ADDRESS, // '0xC5C4a4086FE913b5D525915404C88d12b4031CC0'
  });
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
    console.log('Getting balance of Token');

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(ABIFAKEMana)
        .at(tokenAddress);

      TOKEN_CONTRACT.balanceOf(userAddress, async function (err, amount) {
        if (err) {
          console.log('Getting failed', err);
          reject(false);
        }

        console.log('Getting done');
        resolve(amount);
      });
    } catch (error) {
      console.log('Getting failed', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// returns the amount of MANA contractAddress is approved to spend on behalf of the user
function getAllowedToken(network, userAddress, web3Default = window.web3) {
  let tokenAddress = '';
  if (network == 'ropsten') {
    tokenAddress = ROPSTEN_TOKEN_ADDRESS;
  } else if (network == 'matic') {
    tokenAddress = MATIC_TOKEN_ADDRESS;
  }

  return new Promise(async (resolve, reject) => {
    console.log('Get allowed tokens');
    console.log(web3Default);

    try {
      const TOKEN_CONTRACT = web3Default.eth
        .contract(ABIFAKEMana)
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
    console.log('Approve contract');
    // console.log('token address: ' + tokenAddress);
    // console.log('amount: ' + amount);
    // console.log('user address: ' + userAddress);
    // console.log('rootchain manager address: ' + ROOTCHAINMANAGER_ADDRESS);
    // console.log(web3Default);

    try {
      await maticPOSClient.approveERC20ForDeposit(
        tokenAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex('20000000000'),
        }

        // ,
        // async function (err, hash) {
        //   if (err) {
        //     console.log('Approving failed 1: ', err);

        //     reject(false);
        //   }

        //   const ret = await getConfirmedTx(hash);
        //   if (ret.status == '0x0') {
        //     console.log('Approving transaction failed');
        //     reject(false);
        //   } else {
        //     console.log('Approving done');

        //     resolve(true);
        //   }
        // }
      );

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
// deposit MANA from the Matic Root contract to Matic Network
async function depositTokenToMatic(
  network,
  amount,
  userAddress,
  web3Default = window.web3
) {
  return new Promise(async (resolve, reject) => {
    let tokenAddress = '';
    if (network == 'ropsten') {
      tokenAddress = ROPSTEN_TOKEN_ADDRESS;
    } else if (network == 'matic') {
      tokenAddress = MATIC_TOKEN_ADDRESS;
    }

    console.log('Deposit start');
    console.log('token address: ' + tokenAddress);
    console.log('amount: ' + amount);
    console.log('user address: ' + userAddress);
    console.log('gas limit: ' + GAS_LIMIT);

    try {
      // console.log('amount..');
      // console.log(amount);

      const logs = await maticPOSClient.depositERC20ForUser(
        tokenAddress,
        userAddress,
        amount,
        {
          from: userAddress,
          gasLimit: web3Default.toHex(GAS_LIMIT),
          gasPrice: web3Default.toHex('20000000000'),
        }

        // async function (err, hash) {
        //   if (err) {
        //     console.log('Deposit failed', err);
        //     reject(false);
        //   }

        //   console.log('Deposit done');
        //   resolve(hash);
        // }
      );
      // .then((logs) => resolve(logs.transactionHash));

      // if (err) {
      //   console.log('Deposit failed', err);
      //   reject(false);
      // }

      console.log('Deposit done');
      resolve(logs.transactionHash);

      // resolve(logs.transactionHash);

      // const id = transaction.events.PetCreated.returnValues[0];
      // const owner = transaction.events.PetCreated.returnValues.owner;
    } catch (error) {
      console.log('Deposit failed: ', error);
      reject(false);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// get balance from parent contract and allocated tokens from slots and roulette games
function getBalanceParent(tokenName, web3Default = window.web3) {
  return new Promise(async (resolve, reject) => {
    console.log('Get balance start');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIParent)
        .at(PARENT_CONTRACT_ADDRESS);

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
    console.log('Get tokens per game start');

    try {
      const PARENT_CONTRACT = web3Default.eth
        .contract(ABIParent)
        .at(PARENT_CONTRACT_ADDRESS);

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
    console.log('Deposit start' + amount);
    const userAddress = window.web3.currentProvider.selectedAddress;

    try {
      const PARENT_CONTRACT = window.web3.eth
        .contract(ABIParent)
        .at(PARENT_CONTRACT_ADDRESS);

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
        .at(PARENT_CONTRACT_ADDRESS);

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
          gasLimit: window.web3.toHex(Global.GAS_LIMIT),
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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
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
          gasLimit: window.web3.toHex(Global.GAS_LIMIT),
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

      await delay(2000); // ****************************************
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export default {
  ADMIN_ADDRESSES,
  RELAY_ADDRESS,
  API_BASE_URL,
  BASE_URL,
  FACTOR,
  ROPSTEN_TOKEN_ADDRESS,
  MATIC_TOKEN_ADDRESS,
  PARENT_CONTRACT_ADDRESS,
  TREASURY_SLOTS_ADDRESS,
  TREASURY_ROULETTE_ADDRESS,
  ROOTCHAIN_ADDRESS,
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
  startWithdrawTokenFromMatic,
  processExits,
  depositTokenToMatic,
};
