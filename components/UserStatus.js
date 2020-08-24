import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function UserStatus() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
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
    const response = await Global.FETCH.USER_STATUS(userAddress);
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
