import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Global from '../components/Constants';

function AdminHistory() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      (async function () {
        const responseHistory = await Global.FETCH.ADMIN_HISTORY(userAddress);
        const jsonHistory = await responseHistory.json();
        const dataHistory = jsonHistory.result;

        const responsePlay = await Global.FETCH.MACHINE_DATA(userAddress);
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

export default AdminHistory;
