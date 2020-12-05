import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function AdminData() {
  // dispatch user's transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      (async function () {
        const responseHistory = await Fetch.ADMIN_HISTORY(userAddress);
        const jsonHistory = await responseHistory.json();
        const dataHistory = jsonHistory.result;

        const responsePlay = await Fetch.MACHINE_DATA(userAddress);
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
