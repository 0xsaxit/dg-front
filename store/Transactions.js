import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from 'common/Fetch';

function Transactions() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        const jsonHistory = await Fetch.HISTORY_DATA(state.userAddress);
        const dataHistory = jsonHistory.result;

        const jsonPlay = await Fetch.PLAY_DATA(state.userAddress);
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
