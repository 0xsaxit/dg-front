import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function Transactions() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {

        const jsonHistory = await Fetch.HISTORY_DATA(state.userAddress);
        if (jsonHistory && jsonHistory.result) {
          const dataHistory = jsonHistory.result;

          const jsonPlay = await Fetch.PLAY_DATA(state.userAddress);
          if (jsonPlay && jsonPlay.result) {
            const dataPlay = jsonPlay.result;

            const jsonPoker = await Fetch.POKER_DATA(state.userAddress);
            const response = [dataHistory, dataPlay, jsonPoker];

            dispatch({
              type: 'update_history',
              data: response,
            });
          }
        }
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default Transactions;
