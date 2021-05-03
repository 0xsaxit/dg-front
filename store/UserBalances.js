import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_ROOT_TOKEN from '../components/ABI/ABIDummyToken';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_CHILD_TOKEN_DAI from '../components/ABI/ABIChildTokenDAI';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function UserBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let web3 = {};
  let maticWeb3 = {};
  let binance = {};
  let balances = [];

  useEffect(() => {
    if (state.userStatus >= 4) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor
      binance = new Web3('https://bsc-dataseed1.binance.org:443');

      async function fetchData() {
        console.log('Fetching user balances: ' + state.refreshTokens);

        balances = await getTokenBalances();

        dispatch({
          type: 'update_balances',
          data: balances,
        });
      }

      fetchData();
    }
  }, [state.userStatus, state.refreshTokens]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // function dataInterval() {
  //   async function fetchData() {
  //     const response = await getTokenBalances();

  //     // as soon as the balance updates on Matic display deposit/withdraw confirmation
  //     if (response[0][1] > balances[0][1] || response[1][1] > balances[1][1]) {
  //       console.log('Matic balances have updated: deposit');

  //       dispatch({
  //         type: 'token_pings',
  //         data: 3,
  //       });
  //       const amount = response[1][1] - balances[1][1];
  //       updateHistory(amount, 'Deposit', 'Confirmed');

  //       clearInterval(interval);
  //     } else if (
  //       response[0][1] < balances[0][1] ||
  //       response[1][1] < balances[1][1]
  //     ) {
  //       console.log('Matic balances have updated: withdrawal');

  //       dispatch({
  //         type: 'token_pings',
  //         data: 4,
  //       });
  //       const amount = balances[1][1] - response[1][1];
  //       updateHistory(amount, 'Withdraw', 'Confirmed');

  //       clearInterval(interval);
  //     }
  //   }

  //   // call token contract every 10 seconds to get new balances
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }

  // update transaction history in the database
  // async function updateHistory(amount, type, _state) {
  //   console.log('Writing transaction to database: ' + type);

  //   try {
  //     const response = await Fetch.POST_HISTORY(
  //       state.userAddress,
  //       amount,
  //       type,
  //       _state,
  //       state.txHash,
  //       state.userStatus
  //     );

  //     const json = await response.json();
  //     console.log('Update history complete: ' + json.status);
  //   } catch (error) {
  //     console.log('Update history error: ' + error);
  //   }
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const tokenContractRoot = new web3.eth.Contract(
      ABI_ROOT_TOKEN,
      Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA
    );

    const tokenContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_MANA,
      Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
    );

    const DAIContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_DAI,
      Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
    );

    const USDTContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_DAI,
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    );

    const ATRIContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_DAI,
      '0xb140665dde25c644c6b418e417c930de8a8a6ac9'
    );

    const WETHContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_DAI,
      '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    );

    const BUSDContract = new binance.eth.Contract(
      ABI_ROOT_TOKEN,
      '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    );

    try {
      const amountMANA1 = await Transactions.balanceOfToken(
        tokenContractRoot,
        state.userAddress,
        0
      );

      const amountMANA2 = await Transactions.balanceOfToken(
        tokenContractChild,
        state.userAddress,
        0
      );

      const amountDAI2 = await Transactions.balanceOfToken(
        DAIContractChild,
        state.userAddress,
        0
      );

      const amountUSDT = await Transactions.balanceOfToken(
        USDTContractChild,
        state.userAddress,
        0
      ); 

      async function balanceOfBNB() {
        try {
          const result = await binance.eth.getBalance(state.userAddress);
          const amount = result / 1000000000000000000;

          return amount
        } catch (error) {
          console.log('Get BNB balance failed', error);
        }
      }

      const amountBNB = await balanceOfBNB();

      // get user or contract token balance from MetaMask
      async function balanceOfAtari(tokenContract, userOrContractAddress, units) {
        try {
          const amount = await tokenContract.methods
            .balanceOf(userOrContractAddress)
            .call();

          return amount;
        } catch (error) {
          console.log('Get balance failed', error);
        }
      }

      const amountATRI = await balanceOfAtari(
        ATRIContractChild,
        state.userAddress,
        0
      ); 

      const amountWETH = await Transactions.balanceOfToken(
        WETHContractChild,
        state.userAddress,
        3
      );

      return [
        [0, amountDAI2],
        [amountMANA1, amountMANA2],
        [0, amountUSDT, amountATRI, amountWETH],
        [0, amountBNB],
      ];
    } catch (error) {
      console.log('Get user balances error: ' + error);
    }
  }

  return null;
}

export default UserBalances;
