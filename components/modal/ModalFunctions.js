import ABIDepositManager from '../ABI/ABIDepositManager';
import WithdrawManager from '../ABI/WithdrawManager';
import ChildERC20Token from '../ABI/ChildERC20Token';
import Global from '../constant';

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

    console.log(Global.DEPOSITMANAGER_ADDRESS);

    try {
      // const ROOTCHAIN_CONTRACT = web3.eth
      //   .contract(RootChain.abi)
      //   .at(ROOTCHAIN_ADDRESS);

      const DEPOSITMANAGER_CONTRACT = web3Default.eth
        .contract(ABIDepositManager)
        .at(Global.DEPOSITMANAGER_ADDRESS);

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
export default {
  depositTokenToMatic,
  startWithdrawTokenFromMatic,
  processExits,
};
