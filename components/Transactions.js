import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function Transactions() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userStatus) {
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
  }, [state.userStatus]);

  return null;
}

export default Transactions;
