import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function AdminBalances() {
  // dispatch worker ETH and treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let web3 = {};
  let maticWeb3 = {};
  let balances = [];

  useEffect(() => {
    if (state.userStatus === 28) {
      web3 = new Web3(state.walletProvider); // pass provider to Web3 constructor
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        // const balance = await getEthBalance();
        balances = await getTokenBalances();

        // update global state eth balance and treasury token balances
        // dispatch({
        //   type: 'eth_balance',
        //   data: balance,
        // });

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
  //   // console.log('Worker address ETH balance on Matic Network');

  //   try {
  //     const amount = await maticWeb3.eth.getBalance(
  //       Global.ADDRESSES.WORKER_WALLET_ADDRESS
  //     );

  //     const amountEth = web3.utils.fromWei(amount, 'ether') + ' ETH';
  //     const amountNumber = parseFloat(amountEth).toFixed(4);

  //     return amountNumber;
  //   } catch (error) {
  //     console.log('Get ETH balance error', error);
  //   }
  // }

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
    const tokenContract = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_MANA,
      Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
    );

    try {
      let arrayAmounts = [
        [0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];

      // get Worker address ETH balance on Matic Network
      const amount = await maticWeb3.eth.getBalance(
        Global.ADDRESSES.WORKER_WALLET_ADDRESS
      );
      const amountEth = web3.utils.fromWei(amount, 'ether') + ' ETH';
      const amountNumber = parseFloat(amountEth).toFixed(4);

      // get treasury balances from token contracts
      const amountTreasury = await Transactions.balanceOfToken(
        tokenContract,
        Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
        3
      );
      arrayAmounts[0] = [amountNumber, 0, amountTreasury];

      // get game balances by calling checkGameTokens() on smart contract
      const gameTypes = [1, 8, 7]; // slots, roulette, blackjack
      // let arrayGameAmounts = [];

      // console.log('about to fetch...');
      // console.log(gameTypes);

      await gameTypes.forEach(async (gameType, i) => {
        const amount1 = await getTokensGame(gameType, 0);
        const amount2 = await getTokensGame(gameType, 1);
        const amount3 = await getTokensGame(gameType, 2);
        const amount4 = await getTokensGame(gameType, 3);
        const amount5 = await getTokensGame(gameType, 4);

        // console.log('fething from blockchain...');
        // console.log(
        //   amount1,
        //   +'...' + amount2,
        //   +'...' + amount3,
        //   +'...' + amount4,
        //   +'...' + amount5
        // );

        arrayAmounts[i + 1] = [amount1, amount2, amount3, amount4, amount5, 0];

        // return [amount1, amount2, amount3, amount4, amount5, 0];
      });

      // await arrayAmounts.push(foo);

      // const amountRoulette1 = await getTokensGame(8, 0);
      // const amountBlackjack1 = await getTokensGame(7, 0);

      // let arrayGameAmounts = [];
      // arrayGameAmounts.push([0, amountSlots1]);
      // arrayGameAmounts.push([0, amountRoulette1]);
      // arrayGameAmounts.push([0, amountBlackjack1]);

      // arrayAmounts.push(arrayGameAmounts);

      // console.log('array amoounts...');
      // console.log(arrayAmounts);

      return arrayAmounts;
    } catch (error) {
      console.log('Get admin balances error: ' + error);
    }
  }

  async function getTokensGame(gameIndex, tokenIndex) {
    // console.log(
    //   'Get tokens for game index: ' +
    //     gameIndex +
    //     ' & token index: ' +
    //     tokenIndex
    // );

    const parentContract = await Transactions.treasuryContract(maticWeb3);
    try {
      const amount = await parentContract.methods
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
