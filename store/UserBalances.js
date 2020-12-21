import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_ROOT_TOKEN from '../components/ABI/ABIDummyToken';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_CHILD_TOKEN_DAI from '../components/ABI/ABIChildTokenDAI';
// import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import Global from '../components/Constants';
import Fetch from '../common/Fetch';
import Transactions from '../common/Transactions';

function UserBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  let web3 = {};
  let maticWeb3 = {};
  let balances = [];

  // const value = 6;

  useEffect(() => {
    if (state.userStatus >= 4) {
      userAddress = window.web3.currentProvider.selectedAddress;

      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        balances = await getTokenBalances();

        dispatch({
          type: 'update_balances',
          data: balances,
        });

        // if user has deposited tokens to Matic Network already adjust their status
        // const nonZeroDAI = balances[1][1] !== '0' && balances[1][1] !== 0;
        // if (state.userStatus === 5 && nonZeroDAI) updateStatus(6);

        // const nonZeroMANA = balances[0][1] !== '0' && balances[0][1] !== 0;
        // if (state.userStatus === 5 && nonZeroMANA) updateStatus(7);

        // ping token contract to get new balances
        if (state.tokenPings === 1) dataInterval();
      }
      fetchData();
    }
  }, [state.userStatus, state.tokenPings]);

  // function updateStatus(value) {
  //   // update global state user status
  //   dispatch({
  //     type: 'update_status',
  //     data: value,
  //   });

  //   // update user status in database
  //   console.log('Posting user status to db: ' + value);
  //   Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function dataInterval() {
    async function fetchData() {
      const response = await getTokenBalances();

      // as soon as the balance updates on Matic display deposit/withdraw confirmation
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
    console.log('Writing transaction to database: ' + type);

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
    const addresses = await Global.ADDRESSES;

    const tokenContractRoot = new web3.eth.Contract(
      ABI_ROOT_TOKEN,
      addresses.ROOT_TOKEN_ADDRESS_MANA
    );
    const tokenContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_MANA,
      addresses.CHILD_TOKEN_ADDRESS_MANA
    );

    // const DAIContractRoot = new maticWeb3.eth.Contract(
    //   ABI_CHILD_TOKEN_DAI,
    //   addresses.ROOT_TOKEN_ADDRESS_DAI
    // );
    const DAIContractChild = new maticWeb3.eth.Contract(
      ABI_CHILD_TOKEN_DAI,
      addresses.CHILD_TOKEN_ADDRESS_DAI
    );

    // const DGContractRoot = new web3.eth.Contract(
    //   ABI_DG_TOKEN,
    //   addresses.ROOT_TOKEN_ADDRESS_DG
    // );
    // const DGContractChild = new maticWeb3.eth.Contract(
    //   ABI_DG_TOKEN,
    //   addresses.CHILD_TOKEN_ADDRESS_DG
    // );

    try {
      const amountMANA1 = await Transactions.balanceOfToken(
        tokenContractRoot,
        userAddress,
        0
      );
      const amountMANA2 = await Transactions.balanceOfToken(
        tokenContractChild,
        userAddress,
        0
      );

      // const amountDAI1 = await Transactions.balanceOfToken(
      //   tokenContractRoot,
      //   userAddress,
      //   0
      // );
      const amountDAI2 = await Transactions.balanceOfToken(
        DAIContractChild,
        userAddress,
        0
      );

      // const amountDG1 = await Transactions.balanceOfToken(
      //   DGContractRoot,
      //   userAddress,
      //   3
      // );
      // const amountDG2 = await Transactions.balanceOfToken(
      //   DGContractChild,
      //   userAddress,
      //   3
      // );

      return [
        [0, amountDAI2],
        [amountMANA1, amountMANA2],
        [0, 0],
      ];
    } catch (error) {
      console.log('Get user balances error: ' + error);
    }
  }

  return null;
}

export default UserBalances;
