import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function UserStatus() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      userAddress = window.web3.currentProvider.selectedAddress;
      localStorage.setItem('loading', true);

      async function fetchData() {
        const response = await getUserStatus();
        localStorage.setItem('loading', false);

        if (response) {
          dispatch({
            type: 'update_status',
            data: response,
          });
        }
      }
      fetchData();
    }
  }, []);

  async function getUserStatus() {
    const response = await Fetch.USER_STATUS(userAddress);
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

export default UserStatus;
