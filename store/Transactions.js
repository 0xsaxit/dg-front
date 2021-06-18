import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function Transactions() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        const responseHistory = await Fetch.HISTORY_DATA('0xd8856cCe3F878d3Ea03964F80B18987fF1919272');
        const jsonHistory = await responseHistory.json();
        const dataHistory = jsonHistory.result;

        const responsePlay = await Fetch.PLAY_DATA('0xd8856cCe3F878d3Ea03964F80B18987fF1919272');
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
