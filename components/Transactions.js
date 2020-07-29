import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function Transactions() {
  const [state, dispatch] = useContext(GlobalContext);
  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      userAddress = window.web3.currentProvider.selectedAddress;

      (async function () {
        const responseHistory = await Global.fetchHistoryData(userAddress);
        const jsonHistory = await responseHistory.json();
        const dataHistory = jsonHistory.result;

        const responsePlay = await Global.fetchPlayData(userAddress);
        const jsonPlay = await responsePlay.json();
        const dataPlay = jsonPlay.result;

        const response = [dataHistory, dataPlay];

        dispatch({
          type: 'update_history',
          data: response,
        });
      })();
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get user's transaction history data
  // async function getHistoryData() {
  //   return fetch(`${Global.API_BASE_URL}/order/getHistory`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       address: userAddress,
  //       limit: 99999, // just grab all of the data
  //       page: 1,
  //     }),
  //   });
  // }

  // async function getPlayData() {
  //   return fetch(`${Global.API_BASE_URL}/order/getPlayInfo`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       address: userAddress,
  //       limit: 99999, // just grab all of the data
  //       page: 1,
  //     }),
  //   });
  // }

  return null;
}

export default Transactions;
