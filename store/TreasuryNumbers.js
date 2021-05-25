import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function TreasuryNumbers() {
  // dispatch treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      let response = await Fetch.TREASURY_STATS_NUMBERS('week');
      let json = await response.json();

      dispatch({
        type: 'treasury_numbers',
        data: json,
      });
    })();
  }, []);

  return null;
}

export default TreasuryNumbers;
