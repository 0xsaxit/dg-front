import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function GameRecords() {
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (window.ethereum) {
      (async function () {
        const response = await Global.fetchGameRecords();
        const jsonRecords = await response.json();

        dispatch({
          type: 'update_records',
          data: jsonRecords,
        });
      })();
    }
  }, []);

  return null;
}

export default GameRecords;
