import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function EventsData() {
  // dispatch treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get events from dcl
  useEffect(() => {
    (async () => {
      let response = await Fetch.EVENTS();
      let json = await response.json();

      dispatch({
        type: 'events_data',
        data: json,
      });
    })();
  }, []);

  return null;
}

export default EventsData;
