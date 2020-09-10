import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function AdminBalances() {
  // dispatch user's token balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let contractAddress = '';
  let maticWeb3 = {};
  let balances = [];

  useEffect(() => {
    if (state.userStatus) {
      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        contractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

        balances = await getTokenBalances();

        // update global state user status
        dispatch({
          type: 'admin_balances',
          data: balances,
        });

        // if deposit or withdrawal start pinging the token contract for changed balances
        if (state.tokenPings === 1) dataInterval();
      }
      fetchData();
    }
  }, [state.userStatus, state.tokenPings]);

  function dataInterval() {
    async function fetchData() {
      const response = await getTokenBalances();

      // as soon as the balance updates on Matic display deposit confirmation
      if (response[0][1] > balances[0][1] || response[1][1] > balances[1][1]) {
        console.log('Matic balances have updated: deposit');

        dispatch({
          type: 'token_pings',
          data: 2,
        });

        clearInterval(interval);
      } else if (
        response[0][1] < balances[0][1] ||
        response[1][1] < balances[1][1]
      ) {
        console.log('Matic balances have updated: withdrawal');

        dispatch({
          type: 'token_pings',
          data: 3,
        });

        clearInterval(interval);
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

    const TOKEN_CONTRACT = maticWeb3.eth
      .contract(Global.ABIs.CHILD_TOKEN)
      .at(addresses.CHILD_TOKEN_ADDRESS_MANA);

    try {
      let arrayAmounts = [];

      // get treasury balances from token contracts
      const amountTreasury1 = await Global.balanceOfToken(
        TOKEN_CONTRACT,
        contractAddress
      );
      arrayAmounts.push([0, amountTreasury1]);

      // get game balances by calling checkGameTokens()
      const amountSlots1 = await Global.getTokensGame(1, 0, maticWeb3);
      const amountRoulette1 = await Global.getTokensGame(2, 0, maticWeb3);
      const amountBackgammon1 = await Global.getTokensGame(3, 0, maticWeb3);
      const amountBlackjack1 = await Global.getTokensGame(4, 0, maticWeb3);

      let arrayGameAmounts = [];

      arrayGameAmounts.push([0, amountSlots1]);
      arrayGameAmounts.push([0, amountRoulette1]);
      arrayGameAmounts.push([0, amountBackgammon1]);
      arrayGameAmounts.push([0, amountBlackjack1]);

      arrayAmounts.push(arrayGameAmounts);

      return arrayAmounts;
    } catch (error) {
      console.log('Get balances error: ' + error);
    }
  }

  return null;
}

export default AdminBalances;
