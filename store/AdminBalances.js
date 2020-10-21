import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';

import Web3 from 'web3';

import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_CHILD_TOKEN from '../components/ABI/ABIChildToken';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function AdminBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let maticWeb3 = {};
  let balances = [];
  let workerAddress = '';
  let contractAddress = '';

  useEffect(() => {
    if (state.userStatus) {
      // maticWeb3 = new window.Web3(
      //   new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      // );
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        workerAddress = addresses.WORKER_ADDRESS;
        contractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

        const balance = await getEthBalance();
        balances = await getTokenBalances();

        // update global state eth balance and treasury token balances
        dispatch({
          type: 'eth_balance',
          data: balance,
        });

        dispatch({
          type: 'admin_balances',
          data: balances,
        });

        // if deposit or withdrawal start pinging the token contract for changed balances
        if (state.tokenPings === 2) dataInterval();
      }
      fetchData();
    }
  }, [state.userStatus, state.tokenPings]);

  // get worker address ETH balance on Matic Network
  // async function getEthBalance() {
  //   return new Promise(async (resolve, reject) => {
  //     maticWeb3.eth.getBalance(workerAddress, function (err, result) {
  //       if (err) {
  //         console.log('Get ETH balance error: ' + err);
  //       } else {
  //         const amountEth = web3.fromWei(result, 'ether') + ' ETH';
  //         const amountNumber = parseFloat(amountEth).toFixed(4);

  //         resolve(amountNumber);
  //       }
  //     });
  //   });
  // }

  // get worker address ETH balance on Matic Network
  async function getEthBalance() {
    console.log('Worker address ETH balance on Matic Network');

    try {
      const amount = await maticWeb3.eth.getBalance(workerAddress);

      const amountEth = web3.fromWei(amount, 'ether') + ' ETH';
      const amountNumber = parseFloat(amountEth).toFixed(4);

      return amountNumber;
    } catch (error) {
      console.log('Get ETH balance error', error);
    }

    // {
    //   if (err) {
    //     console.log('Get ETH balance error: ' + err);
    //   } else {
    //     const amountEth = web3.fromWei(result, 'ether') + ' ETH';
    //     const amountNumber = parseFloat(amountEth).toFixed(4);

    //     resolve(amountNumber);
    //   }
    // });
  }

  function dataInterval() {
    async function fetchData() {
      const response = await getTokenBalances();

      // as soon as the balance updates on Matic display confirmation & stop pings
      if (
        response[0][1] !== balances[0][1] ||
        response[1][1] !== balances[1][1]
      ) {
        if (
          response[0][1] > balances[0][1] ||
          response[1][1] > balances[1][1]
        ) {
          console.log('Matic balances have updated: deposit');

          dispatch({
            type: 'token_pings',
            data: 3,
          });

          clearInterval(interval);
        } else if (
          response[0][1] < balances[0][1] ||
          response[1][1] < balances[1][1]
        ) {
          console.log('Matic balances have updated: withdrawal');

          dispatch({
            type: 'token_pings',
            data: 4,
          });

          clearInterval(interval);
        }
      }
    }

    // call token contract every 3 seconds to get new balances
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get total funds and individual game amounts
  async function getTokenBalances() {
    const addresses = await Global.API_ADDRESSES;

    // const tokenContract = maticWeb3.eth
    //   .contract(ABI_CHILD_TOKEN)
    //   .at(addresses.CHILD_TOKEN_ADDRESS_MANA);
    const tokenContract = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN,
      addresses.CHILD_TOKEN_ADDRESS_MANA
    );

    try {
      let arrayAmounts = [];

      // get treasury balances from token contracts
      const amountTreasury = await Transactions.balanceOfToken2(
        tokenContract,
        contractAddress,
        0
      );
      arrayAmounts.push([0, amountTreasury]);

      // get game balances by calling checkGameTokens()
      const amountSlots1 = await getTokensGame(1, 0);
      const amountRoulette1 = await getTokensGame(2, 0);
      const amountBackgammon1 = await getTokensGame(3, 0);
      const amountBlackjack1 = await getTokensGame(4, 0);

      let arrayGameAmounts = [];

      arrayGameAmounts.push([0, amountSlots1]);
      arrayGameAmounts.push([0, amountRoulette1]);
      arrayGameAmounts.push([0, amountBackgammon1]);
      arrayGameAmounts.push([0, amountBlackjack1]);

      arrayAmounts.push(arrayGameAmounts);

      return arrayAmounts;
    } catch (error) {
      console.log('Get admin balances error: ' + error);
    }
  }

  // function getTokensGame(gameIndex, tokenIndex, web3Default) {
  //   return new Promise(async (resolve, reject) => {
  //     console.log('Get tokens per game');

  //     try {
  //       const PARENT_CONTRACT = web3Default.eth
  //         .contract(ABI_TREASURY_CONTRACT)
  //         .at(contractAddress);

  //       PARENT_CONTRACT.checkGameTokens(gameIndex, tokenIndex, async function (
  //         err,
  //         amount
  //       ) {
  //         if (err) {
  //           console.log('Get tokens per game failed', err);
  //           reject(false);
  //         }

  //         const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
  //           .toFixed(0)
  //           .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //         resolve(amountAdjusted);
  //       });
  //     } catch (error) {
  //       console.log('Get tokens per game failed', error);
  //       reject(false);
  //     }
  //   });
  // }

  async function getTokensGame(gameIndex, tokenIndex) {
    console.log('Get tokens per game');

    // const PARENT_CONTRACT = web3Default.eth
    //   .contract(ABI_TREASURY_CONTRACT)
    //   .at(contractAddress);
    const PARENT_CONTRACT = new maticWeb3.eth.Contract(
      ABI_TREASURY_CONTRACT,
      contractAddress
    );

    try {
      const amount = await PARENT_CONTRACT.methods
        .checkGameTokens(gameIndex, tokenIndex)
        .call();

      const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return amountAdjusted;
    } catch (error) {
      console.log('Get tokens per game failed', error);
    }
  }

  return null;
}

export default AdminBalances;
