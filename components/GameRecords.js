import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function GameRecords() {
  // dispatch user's game records to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus) {
      (async function () {
        const response = await Global.FETCH.GAME_RECORDS();
        const jsonRecords = await response.json();

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
