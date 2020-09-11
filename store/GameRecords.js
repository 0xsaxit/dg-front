import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Global from '../components/Constants';

function GameRecords() {
  // dispatch user's game records to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    (async function () {
      const response = await Global.FETCH.GAME_RECORDS();
      const jsonRecords = await response.json();

      dispatch({
        type: 'update_records',
        data: jsonRecords,
      });
    })();
  }, []);

  return null;
}

export default GameRecords;
