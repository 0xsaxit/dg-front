import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';

import Web3 from 'web3';

import ABI_ROOT_TOKEN from '../components/ABI/ABIDummyToken';
import ABI_CHILD_TOKEN from '../components/ABI/ABIChildToken';
import Global from '../components/Constants';
import Fetch from '../common/Fetch';
import Transactions from '../common/Transactions';

function UserBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  const value = 6;

  let web3 = {};

  let maticWeb3 = {};
  let balances = [];

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      // maticWeb3 = new window.Web3(
      //   new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      // );
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        balances = await getTokenBalances();

        dispatch({
          type: 'update_balances',
          data: balances,
        });

        // if user has deposited tokens to Matic Network already adjust their status
        const nonZeroMANA = balances[0][1] !== '0' && balances[0][1] !== 0;
        const nonZeroDAI = balances[1][1] !== '0' && balances[1][1] !== 0;

        if (state.userStatus === 5 && (nonZeroMANA || nonZeroDAI)) {
          updateStatus();
        } else if (state.tokenPings === 1) {
          dataInterval();
        }
      }
      fetchData();
    }
  }, [state.userStatus, state.tokenPings]);

  function updateStatus() {
    // update global state user status
    dispatch({
      type: 'update_status',
      data: value,
    });

    // update user status in database
    console.log('Posting user status to db: ' + value);
    Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function dataInterval() {
    async function fetchData() {
      const response = await getTokenBalances();

      // as soon as the balance updates on Matic display deposit confirmation
      if (response[0][1] > balances[0][1] || response[1][1] > balances[1][1]) {
        console.log('Matic balances have updated: deposit');

        dispatch({
          type: 'token_pings',
          data: 3,
        });
        const amount = response[1][1] - balances[1][1];
        updateHistory(amount, 'Deposit', 'Confirmed');

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
        const amount = balances[1][1] - response[1][1];
        updateHistory(amount, 'Withdraw', 'Confirmed');

        clearInterval(interval);
      }
    }

    // call token contract every 10 seconds to get new balances
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }

  // update transaction history in the database
  async function updateHistory(amount, type, _state) {
    console.log('Writing to database: ' + type);

    try {
      const response = await Fetch.POST_HISTORY(
        userAddress,
        amount,
        type,
        _state,
        state.txHash,
        state.userStatus
      );

      const json = await response.json();
      console.log('Update history complete: ' + json.status);
    } catch (error) {
      console.log('Update history error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const addresses = await Global.API_ADDRESSES;

    // const TOKEN_CONTRACT_ROOT = window.web3.eth
    //   .contract(ABI_ROOT_TOKEN)
    //   .at(addresses.ROOT_TOKEN_ADDRESS_MANA);
    const TOKEN_CONTRACT_ROOT = new web3.eth.Contract(
      ABI_ROOT_TOKEN,
      addresses.ROOT_TOKEN_ADDRESS_MANA
    );

    // const TOKEN_CONTRACT_CHILD = maticWeb3.eth
    //   .contract(ABI_CHILD_TOKEN)
    //   .at(addresses.CHILD_TOKEN_ADDRESS_MANA);
    const TOKEN_CONTRACT_CHILD = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN,
      addresses.CHILD_TOKEN_ADDRESS_MANA
    );

    try {
      const amount1 = await Transactions.balanceOfToken2(
        TOKEN_CONTRACT_ROOT,
        userAddress,
        0
      );
      const amount2 = await Transactions.balanceOfToken2(
        TOKEN_CONTRACT_CHILD,
        userAddress,
        0
      );

      return [
        [0, 0],
        [amount1, amount2],
      ];
    } catch (error) {
      console.log('Get user balances error: ' + error);
    }
  }

  return null;
}

export default UserBalances;
