import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function TreasuryNumbers() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        let response = await Fetch.TREASURY_STATS_NUMBERS(state.userAddress);
        let json = await response.json();

        dispatch({
          type: 'treasury_numbers',
          data: json,
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default TreasuryNumbers;
