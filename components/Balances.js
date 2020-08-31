import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Web3 from 'web3';
import Global from './Constants';

function Balances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  const value = 6;
  let web3 = {};
  let maticWeb3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window['ethereum']); // pass MetaMask provider to Web3 constructor
      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );

      async function fetchData() {
        const response = await getTokenBalances();

        dispatch({
          type: 'update_balances',
          data: response,
        });

        // console.log('balances...');
        // console.log(response);
        // console.log('non zero values?');

        const nonZeroMANA = response[0].some(
          (item) => item !== '0' && item !== 0
        );
        const nonZeroDAI = response[1].some(
          (item) => item !== '0' && item !== 0
        );

        // console.log(nonZeroMANA);
        // console.log(nonZeroDAI);

        if (state.userStatus === 5 && (nonZeroMANA || nonZeroDAI)) {
          updateStatus();
        }
      }
      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.tokenPings === 1) {
      async function fetchData() {
        const response = await getTokenBalances();

        if (response.length) {
          updateStatus();
        }

        // display the message box with deposit confirmation
        dispatch({
          type: 'token_pings',
          data: 2,
        });
      }

      // call token contract every 10 seconds to get new balances
      const interval = setInterval(() => {
        fetchData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [state.tokenPings]);

  function updateStatus() {
    // update global state user status
    dispatch({
      type: 'update_status',
      data: value,
    });

    // update user status in database
    console.log('Posting user status to db: ' + value);
    Global.FETCH.USER_VERIFY(userAddress, value);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const addresses = await Global.API_ADDRESSES;

    const TOKEN_CONTRACT_ROOT = window.web3.eth
      .contract(Global.ABIs.ROOT_TOKEN)
      .at(addresses.ROOT_TOKEN_ADDRESS_MANA);

    // const TOKEN_CONTRACT_ROOT = new web3.eth.Contract(
    //   Global.ABIs.ROOT_TOKEN,
    //   addresses.ROOT_TOKEN_ADDRESS_MANA
    // );

    // const TOKEN_CONTRACT_ROOT = web3
    //   .contract(Global.ABIs.ROOT_TOKEN)
    //   .at(addresses.ROOT_TOKEN_ADDRESS_MANA);

    const TOKEN_CONTRACT_CHILD = maticWeb3.eth
      .contract(Global.ABIs.CHILD_TOKEN)
      .at(addresses.CHILD_TOKEN_ADDRESS_MANA);

    try {
      const amount1 = await Global.balanceOfToken(
        TOKEN_CONTRACT_ROOT,
        userAddress
      );
      const amount2 = await Global.balanceOfToken(
        TOKEN_CONTRACT_CHILD,
        userAddress
      );

      return [
        [amount1, amount2],
        [0, 0],
      ];
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

export default Balances;
