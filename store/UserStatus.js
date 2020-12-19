import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function UserStatus() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [userAddress, setUserAddress] = useState('');

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // console.log('user address... ' + userAddress);

      if (userAddress) {
        // set user status to 3 to denote fetching user status
        if (userAddress) {
          dispatch({
            type: 'update_status',
            data: 3,
          });
        }

        // ************************* this will return an error if new wallet address *************************

        // fetch user status
        async function fetchData() {
          // console.log('fetching data...');

          // try {
          const response = await getUserStatus();

          // console.log('response... ' + response);

          // if the response is truthy set the user's respective status, else set status back to 0
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

          // } catch {
          //   console.log('error error error 2...');

          //   if (userAddress) {
          //     dispatch({
          //       type: 'update_status',
          //       data: 0,
          //     });
          //   }
          // }
        }

        fetchData();
      }
    }
  }, []);

  async function getUserStatus() {
    const response = await Fetch.USER_STATUS(userAddress);
    const json = await response.json();

    localStorage.setItem('storedStatus', json.result);

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
