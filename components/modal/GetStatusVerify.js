import React, { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Aux from '../_Aux';
import Global from '../Constants';

const GetStatusVerify = () => {
  // const [state, dispatch] = useContext(GlobalContext);
  // console.log('dashboard value: ' + state.dashboard);

  // const [state, dispatch] = useContext(GlobalContext);
  // dispatch({ type: 'update_status', status: () => { fetchUserStatus() } });

  let userAddress = '';

  // useEffect(async () => {
  //   if (window.web3) {
  //     userAddress = window.web3.currentProvider.selectedAddress;

  //     const status = await getUserStatus();

  //     // const [state, dispatch] = useContext(GlobalContext);
  //     // dispatch({ type: 'update_status', status: status });
  //   }
  // });

  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const response = await MyAPI.getData(someId);
  //     // ...
  //   }
  //   fetchData();
  // }, [someId]); // Or [] if effect doesn't need props or state

  let response = true;

  const [state, dispatch] = useContext(GlobalContext);
  dispatch({ type: 'update_status', status: response });

  useEffect(() => {
    if (window.web3) {
      userAddress = window.web3.currentProvider.selectedAddress;

      async function fetchData() {
        response = await getUserStatus();

        // const [state, dispatch] = useContext(GlobalContext);
        // dispatch({ type: 'update_status', status: response });
      }
      fetchData();
    }
  }, []); // Or [] if effect doesn't need props or state

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get user's onboard status
  async function getUserStatus() {
    console.log("getting user's onboard status...");

    const response = await fetchUserStatus();
    const json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('no data returned');

        return false;
      }

      const stepValue = parseInt(json.result);
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

  return <Aux>Fetching user status...</Aux>;
};

export default GetStatusVerify;
