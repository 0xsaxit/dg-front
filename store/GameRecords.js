import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function GameRecords() {
  // dispatch user's game records to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        const jsonRecords = await Fetch.GAME_RECORDS(state.userAddress);

        dispatch({
          type: 'update_records',
          data: jsonRecords,
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default GameRecords;
