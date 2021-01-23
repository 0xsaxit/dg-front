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
      userAddress = window.ethereum.selectedAddress;

      if (userAddress) {
        // set user status to 3 to denote fetching user status, and dispatch the user address
        if (userAddress) {
          dispatch({
            type: 'update_status',
            data: 3,
          });

          dispatch({
            type: 'user_address',
            data: userAddress,
          });
        }

        // fetch user status
        async function fetchData() {
          const response = await getUserStatus();

          // if the response is truthy set the user's respective status, else set status back to 0
          // (/verifyAddress API call will return error if new wallet address)
          if (response) {
            dispatch({
              type: 'update_status',
              data: response,
            });
          } else {
            if (userAddress) {
              dispatch({
                type: 'update_status',
                data: 0,
              });
            }
          }
        }

        fetchData();
      }
    }
  }, []);

  async function getUserStatus() {
    try {
      const response = await Fetch.USER_STATUS(userAddress);
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }
        const stepValue = parseInt(json.result);

        return stepValue;
      }
    } catch {
      console.log('Unregistered wallet');

      return 0;
    }
  }

  return null;
}

export default UserStatus;
