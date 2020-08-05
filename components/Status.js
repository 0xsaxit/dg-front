import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function Status() {
  const [state, dispatch] = useContext(GlobalContext);
  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      userAddress = window.web3.currentProvider.selectedAddress;

      async function fetchData() {
        const response = await getUserStatus();

        dispatch({
          type: 'update_status',
          data: response,
        });
      }
      fetchData();
    }
  }, []);

  async function getUserStatus() {
    const response = await Global.fetchUserStatus(userAddress);
    const json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        return false;
      }
      const stepValue = parseInt(json.result);

      return stepValue;
    }
  }

  return null;
}

export default Status;
