import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function AdminData() {
  // dispatch user's transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        const responseHistory = await Fetch.ADMIN_HISTORY(state.userAddress);
        const jsonHistory = await responseHistory.json();
        const dataHistory = jsonHistory.result;

        const responsePlay = await Fetch.MACHINE_DATA(state.userAddress);
        const jsonPlay = await responsePlay.json();
        const dataMachines = jsonPlay.result;

        const response = [dataHistory, dataMachines];

        dispatch({
          type: 'admin_history',
          data: response,
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default AdminData;
