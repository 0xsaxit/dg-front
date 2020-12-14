import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
// import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
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
    if (state.userStatus >= 4) {
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        workerAddress = addresses.WORKER_WALLET_ADDRESS;
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

    const tokenContract = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_MANA,
      addresses.CHILD_TOKEN_ADDRESS_MANA
    );

    try {
      let arrayAmounts = [];

      // get treasury balances from token contracts
      const amountTreasury = await Transactions.balanceOfToken(
        tokenContract,
        contractAddress,
        3
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

  async function getTokensGame(gameIndex, tokenIndex) {
    console.log('Get tokens per game');

    // const parentContract = new maticWeb3.eth.Contract(
    //   ABI_TREASURY_CONTRACT,
    //   contractAddress
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
