import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function GameRecords() {
  // dispatch user's game records to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress;

      (async function () {
        // const response = await Fetch.GAME_RECORDS(userAddress);
        // const jsonRecords = await response.json();

        const jsonRecords = '';

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
