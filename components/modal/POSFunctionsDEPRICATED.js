// import {
//   ROOT_CHAIN_MANAGER_ABI,
//   CHILD_CHAIN_MANAGER_ABI,
//   ROOT_CHAIN_MANAGER_ADDRESS,
//   CHILD_CHAIN_MANAGER_ADDRESS,
//   PLASMA_ROOT_CHAIN_ADDRESS,
//   ROOT_DUMMY_TOKEN_ABI,
//   ROOT_DUMMY_TOKEN_ADDRESS,
//   ERC20_ABI,
//   ROOT_PROVIDER,
//   CHILD_PROVIDER,
// } from '../constants';

const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient;
import Global from '../constant';

// const config = require('../constants/config');

// const maticPOSClient = new MaticPOSClient({
//   maticProvider: config.MATIC_PROVIDER,
//   parentProvider: window.ethereum,
//   rootChain: PLASMA_ROOT_CHAIN_ADDRESS,
//   posRootChainManager: ROOT_CHAIN_MANAGER_ADDRESS,
// });

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// create MaticPOSClient object to deposit tokens from Main net to Matic Network
maticPOSClient = new MaticPOSClient({
  maticProvider: Global.MATIC_URL,
  parentProvider: window.ethereum,
  rootChain: Global.ROOTCHAIN_ADDRESS,
  posRootChainManager: Global.ROOTCHAINMANAGER_ADDRESS,
});

const Web3 = require('web3');
window.ethereum.enable().catch((error) => {
  console.log(error);
});

const web3 = new Web3(window.ethereum);
export const getNetwork = async () => {
  const chainId = await web3.eth.net.getId();
  let network;
  if (chainId === 3) network = 'Ropsten';
  else if (chainId === 15001) network = 'Matic';
  else network = 'Unknown';
  return network;
};
export async function getDefaultAccount() {
  try {
    const accounts = await getAccounts();
    if (accounts && accounts.length >= 1) {
      return accounts[0];
    }
  } catch (e) {
    // ignore
  }
  return null;
}
// get accounts
export function getAccounts() {
  return window.ethereum.enable().then(() => {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  });
}

export const mint = async () => {
  const pAmount = '2';
  const address = await getDefaultAccount();
  const userBalance = await getUserTokenBalance(
    ROOT_DUMMY_TOKEN_ADDRESS,
    ROOT_PROVIDER
  );
  if (userBalance < 1) {
    const token = new web3.eth.Contract(
      ROOT_DUMMY_TOKEN_ABI,
      ROOT_DUMMY_TOKEN_ADDRESS
    );
    const amount = web3.utils.toWei(pAmount + '');
    await token.methods.mint(amount).send({ from: address });
  } else {
    alert("don't be greedy");
  }
};

export const getAmountInEth = (pAmount) => {
  const web3 = new Web3(window.ethereum);
  const amount = web3.utils.fromWei(pAmount + '');
  return amount;
};

export const getUserTokenBalance = async (pTokenAddress, provider) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const address = await getDefaultAccount();
  const token = new web3.eth.Contract(ERC20_ABI, pTokenAddress);
  const balance = await token.methods.balanceOf(address).call();
  return getAmountInEth(balance);
};

export const getEthBalance = async (provider) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const address = await getDefaultAccount();
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance);
  // return balance;
};

export const rootToMatic = async (rootToken, amount) => {
  await approve(rootToken, amount);
  await deposit(rootToken, amount);
};

// export const maticToRoot = async () =>{
//   const hash = await burn();
//   console.log("Now waiting for 6 mins for the checkpoint");
//   await PromiseTimeout(360000);
//   await exit(hash);
// }

export const mapTokenRootChain = async (rootToken, childToken) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(ROOT_PROVIDER));
  const rootChainManager = web3.eth.Contract(
    ROOT_CHAIN_MANAGER_ABI,
    ROOT_CHAIN_MANAGER_ADDRESS
  );
  await rootChainManager.methods.mapToken(rootToken, childToken);
};

export const mapTokenChildChain = async (rootToken, childToken) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(CHILD_PROVIDER));
  const childChainManager = web3.eth.Contract(
    CHILD_CHAIN_MANAGER_ABI,
    CHILD_CHAIN_MANAGER_ADDRESS
  );
  await childChainManager.methods.mapToken(rootToken, childToken);
};

export const checkMapToken = async (rootToken, childToken) => {
  const rootChainManager = new web3.eth.Contract(
    ROOT_CHAIN_MANAGER_ABI,
    ROOT_CHAIN_MANAGER_ADDRESS
  );
  const rootToChild = await rootChainManager.methods
    .rootToChildToken(rootToken)
    .call();
  const childToRoot = await rootChainManager.methods
    .childToRootToken(childToken)
    .call();
  console.log(
    rootToChild,
    childToRoot,
    rootToChild === childToken,
    childToRoot === rootToken
  );
  if (rootToChild === childToken && childToRoot === rootToken) {
    alert('Token is mapped');
  } else {
    alert('Token is not mapped!!!');
  }
};

async function PromiseTimeout(delayms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, delayms);
  });
}

export const approve = async (rootToken, pAmount) => {
  const amount = web3.utils.toWei(pAmount + '');
  console.log(amount, pAmount);
  console.log(rootToken);
  const from = await getDefaultAccount();
  await maticPOSClient
    .approveERC20ForDeposit(rootToken, amount, { from })
    .then(async (logs) => {
      console.log('Approve: ' + logs.transactionHash);
    });
};
export const deposit = async (rootToken, pAmount) => {
  const amount = web3.utils.toWei(pAmount + '');
  console.log(amount, pAmount);
  const from = await getDefaultAccount();
  await maticPOSClient
    .depositERC20ForUser(rootToken, from, amount, {
      from,
      gasPrice: '80000000000',
    })
    .then(async (logs) => {
      console.log('Deposit: ' + logs.transactionHash);
    });
};

export const depositEth = async (pAmount) => {
  const amount = web3.utils.toWei(pAmount + '');
  console.log(amount, pAmount);
  const from = await getDefaultAccount();
  await maticPOSClient
    .depositEtherForUser(from, amount, {
      from,
      gasPrice: '80000000000',
    })
    .then(async (logs) => {
      console.log('Deposit ETH: ' + logs.transactionHash);
    });
};

export const burn = async (childToken, pAmount) => {
  const maticPOSClient = new MaticPOSClient({
    maticProvider: window.ethereum,
    parentProvider: ROOT_PROVIDER,
    rootChain: PLASMA_ROOT_CHAIN_ADDRESS,
    posRootChainManager: ROOT_CHAIN_MANAGER_ADDRESS,
  });
  const amount = web3.utils.toWei(pAmount + '');
  const from = await getDefaultAccount();
  console.log(from, amount);
  let tx;
  await maticPOSClient
    .burnERC20(childToken, amount, { from })
    .then(async (logs) => {
      console.log('Burn: ' + logs.transactionHash);
      tx = logs.transactionHash;
    });
  return tx;
};

export const exit = async (burnTxHash) => {
  const from = await getDefaultAccount();
  await maticPOSClient.exitERC20(burnTxHash, { from }).then(async (logs) => {
    console.log('Exit: ' + logs.transactionHash);
  });
};
