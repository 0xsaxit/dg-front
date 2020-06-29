import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function Status() {
  const [state, dispatch] = useContext(GlobalContext);
  let userAddress = '';

  useEffect(() => {
    // if (window.web3) {
    userAddress = window.web3.currentProvider.selectedAddress;

    async function fetchData() {
      const response = await getUserStatus();

      dispatch({
        type: 'update_status',
        data: response,
      });
    }
    fetchData();
    // }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get user's onboard status
  async function getUserStatus() {
    const response = await fetchUserStatus();
    const json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('No user status data');
        return false;
      }

      const stepValue = parseInt(json.result);
      console.log('User status: ' + stepValue);

      if (stepValue > 3) {
        return true;
      } else {
        return false;
      }
    }
  }

  function fetchUserStatus() {
    return fetch(`${Global.API_BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
      }),
    });
  }

  return null;
}

export default Status;
